CREATE EXTENSION citext;
CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

CREATE TYPE account_status AS ENUM ('active', 'inactive', 'disconnected');

CREATE TABLE IF NOT EXISTS public.accounts
(
    id serial,
    user_id uuid NOT NULL DEFAULT auth.uid(),
    stripe_pm_id text UNIQUE,
    stripe_fca_id text UNIQUE,
    last4 text,
    institution_name text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    percentage numeric(3,3) DEFAULT 0.100 NOT NULL CHECK (percentage > 0),
    status account_status NOT NULL DEFAULT 'active',
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.accounts
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read their own"
    ON public.accounts
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT auth.uid(),
    first_name text,
    last_name text,
    stripe_cus_id text NOT NULL UNIQUE,
    current_account_id int,
    last_acceptance jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_user_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT users_current_account_id_fkey FOREIGN KEY (current_account_id)
        REFERENCES public.accounts (id) MATCH SIMPLE
);

CREATE FUNCTION email(public.users) RETURNS text SECURITY DEFINER STABLE AS $$
  SELECT email::text FROM auth.users a WHERE a.id = $1.id
$$ LANGUAGE SQL;

REVOKE UPDATE ON public.users FROM anon, authenticated;
GRANT UPDATE ("first_name", "last_name") ON public.users TO authenticated;

ALTER TABLE IF EXISTS public.users
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read own profile"
    ON public.users
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (auth.uid() = id);
CREATE POLICY "Owner can update own profile"
    ON public.users
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (auth.uid() = id);

CREATE FUNCTION set_active_account()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE public.users SET current_account_id = NEW.id WHERE id = NEW.user_id;
    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION maybe_attach_to_account()
  RETURNS TRIGGER AS $$
  DECLARE
    unused_id int;
  BEGIN
    SELECT id INTO unused_id FROM public.accounts WHERE user_id = NEW.user_id AND stripe_fca_id IS NULL LIMIT 1;

    IF NEW.stripe_fca_id IS NOT NULL AND unused_id IS NOT NULL THEN
        UPDATE public.accounts a
        SET
            stripe_pm_id = NEW.stripe_pm_id,
            stripe_fca_id = NEW.stripe_fca_id,
            last4 = NEW.last4,
            institution_name = NEW.institution_name
        WHERE id = unused_id;

        RETURN NULL;
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_account_before_insert
  BEFORE INSERT ON public.accounts
  FOR EACH ROW
  EXECUTE PROCEDURE maybe_attach_to_account();

CREATE TRIGGER handle_account_after_insert
  AFTER INSERT ON public.accounts
  FOR EACH ROW
  EXECUTE PROCEDURE set_active_account();

CREATE TYPE designated_input as(
    pledge_org_id text,
    weight float
);

CREATE OR REPLACE FUNCTION public.register(
	stripe_cus_id text,
    first_name text,
    last_name text,
	percentage numeric,
	designated designated_input[]
)
    RETURNS void
    SECURITY DEFINER
    LANGUAGE 'plpgsql'
    VOLATILE
AS $$
BEGIN
    INSERT INTO public.users (stripe_cus_id, first_name, last_name) VALUES ($1, $2, $3);
    WITH new_account AS (
        INSERT INTO public.accounts (percentage) VALUES ($4) RETURNING *
    )
    INSERT INTO public.designated (account_id, pledge_org_id, weight) SELECT new_account.id, d.pledge_org_id, d.weight FROM UNNEST($5) d, new_account;
END;
$$;

CREATE OR REPLACE FUNCTION public.email_exists(
	email character varying)
    RETURNS boolean
    SECURITY DEFINER
    LANGUAGE 'plpgsql'
    STABLE
    SET search_path=auth, pg_temp
AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1
        FROM auth.users au
        WHERE au.email = $1
        AND EXISTS(
            SELECT 1
            FROM public.users pu
            WHERE pu.id = au.id
        )
    );
END;
$$;

CREATE TABLE IF NOT EXISTS public.designated
(
    user_id uuid DEFAULT auth.uid(),
    account_id int,
    pledge_org_id text,
    weight float NOT NULL DEFAULT 1 CHECK (weight > 0),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    CONSTRAINT designated_pkey PRIMARY KEY (user_id, account_id, pledge_org_id),
    CONSTRAINT designated_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT designated_account_id_fkey FOREIGN KEY (account_id)
        REFERENCES public.accounts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.designated
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner has all permissions"
    ON public.designated
    AS PERMISSIVE
    FOR ALL
    TO public
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.requests
(
    id serial,
    ngo_id text NOT NULL,
    user_id uuid DEFAULT auth.uid(),
    email email,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.requests
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous users can create their own"
ON public.requests
    AS PERMISSIVE
    FOR INSERT
    TO anon
    WITH CHECK (user_id is null and email is not null);

CREATE POLICY "Authenticated users can create their own"
ON public.requests
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id and email is null);