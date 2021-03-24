CREATE TABLE public.staff
(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(200),
    kind smallint NOT NULL,
    custom jsonb,
    dob date
)