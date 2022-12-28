ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN recurring_tip integer CHECK (recurring_tip > 0);


CREATE TABLE IF NOT EXISTS public.tips (
  only_one bool PRIMARY KEY DEFAULT TRUE,
  ytd integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT only_one CHECK (only_one)
);

ALTER TABLE IF EXISTS public.tips
    OWNER to postgres;
  
ALTER TABLE public.tips REPLICA IDENTITY FULL; -- get previous data in updates

REVOKE ALL ON TABLE public.tips FROM anon, authenticated;
GRANT SELECT ON TABLE public.tips TO anon, authenticated;

GRANT ALL ON TABLE public.tips TO postgres, service_role;

INSERT INTO public.tips DEFAULT VAlUES;

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers get executed in alphabetical order
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.tips
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

CREATE FUNCTION set_ytd()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Reset on a new year
    if (EXTRACT(YEAR FROM new.updated_at) > EXTRACT(YEAR FROM old.updated_at)) then
      new.ytd = GREATEST(0, new.ytd);
    else
      new.ytd = old.ytd + new.ytd;
    end if;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- Triggers get executed in alphabetical order
CREATE TRIGGER handle_ytd
  BEFORE UPDATE ON public.tips
  FOR EACH ROW
  EXECUTE PROCEDURE set_ytd();