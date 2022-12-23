-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE EXTENSION citext;
CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

CREATE TYPE designated_input as(
    change_id text,
    weight float
);

CREATE OR REPLACE FUNCTION public.register(
	stripe_id text,
	change_id text,
	first_name text,
	last_name text,
	percentage numeric,
	designated designated_input[]
)
    RETURNS void
    SECURITY DEFINER
    LANGUAGE 'plpgsql'
    VOLATILE
AS $BODY$
BEGIN
    INSERT INTO public.profiles (stripe_id, change_id, first_name, last_name, percentage) VALUES ($1, $2, $3, $4, $5);
    INSERT INTO public.designated (change_id, weight) SELECT * FROM UNNEST($6);
END;
$BODY$;

ALTER FUNCTION public.register(text, text, text, text, numeric, designated_input[])
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.register(text, text, text, text, numeric, designated_input[]) TO public, anon, authenticated, postgres, service_role;

CREATE OR REPLACE FUNCTION public.email_exists(
	email character varying)
    RETURNS boolean
    SECURITY DEFINER
    LANGUAGE 'plpgsql'
    STABLE
    SET search_path=auth, pg_temp
AS $BODY$
BEGIN
    RETURN EXISTS(
        SELECT 1
        FROM auth.users u
        WHERE u.email = $1
        AND EXISTS(
            SELECT 1
            FROM public.profiles p
            WHERE p.user_id = u.id
        )
    );
END;
$BODY$;

ALTER FUNCTION public.email_exists(character varying)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.email_exists(character varying) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.email_exists(character varying) TO anon;

GRANT EXECUTE ON FUNCTION public.email_exists(character varying) TO authenticated;

GRANT EXECUTE ON FUNCTION public.email_exists(character varying) TO postgres;

GRANT EXECUTE ON FUNCTION public.email_exists(character varying) TO service_role;

CREATE TABLE IF NOT EXISTS public.designated
(
    user_id uuid NOT NULL DEFAULT auth.uid(),
    change_id text NOT NULL COLLATE pg_catalog."default",
    weight float NOT NULL DEFAULT 1 CHECK (weight > 0),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    CONSTRAINT designated_pkey PRIMARY KEY (user_id, change_id),
    CONSTRAINT designated_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.designated
    OWNER to postgres;

ALTER TABLE IF EXISTS public.designated
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.designated TO anon;

GRANT ALL ON TABLE public.designated TO authenticated;

GRANT ALL ON TABLE public.designated TO postgres;

GRANT ALL ON TABLE public.designated TO service_role;
CREATE POLICY "Owner has all permissions"
    ON public.designated
    AS PERMISSIVE
    FOR ALL
    TO public
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.requests
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    change_id text NOT NULL COLLATE pg_catalog."default",
    user_id uuid DEFAULT auth.uid(),
    email email,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.requests
    OWNER to postgres;

ALTER TABLE IF EXISTS public.requests
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.requests TO anon;

GRANT ALL ON TABLE public.requests TO authenticated;

GRANT ALL ON TABLE public.requests TO postgres;

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

CREATE TABLE IF NOT EXISTS public.profiles
(
    user_id uuid NOT NULL DEFAULT auth.uid(),
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    percentage numeric(3,3) NOT NULL CHECK (percentage > 0),
    stripe_id text NOT NULL COLLATE pg_catalog."default" UNIQUE,
    change_id text NOT NULL COLLATE pg_catalog."default" UNIQUE,
    plaid_institution_id text COLLATE pg_catalog."default" UNIQUE,
    plaid_account_mask text COLLATE pg_catalog."default" UNIQUE,
    plaid_account_type text COLLATE pg_catalog."default" UNIQUE,
    plaid_account_subtype text COLLATE pg_catalog."default" UNIQUE,
    CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;

ALTER TABLE IF EXISTS public.profiles
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;
CREATE POLICY "Owner can read own profile"
    ON public.profiles
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (auth.uid() = user_id);
CREATE POLICY "Owner can update own profile"
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (auth.uid() = user_id);
