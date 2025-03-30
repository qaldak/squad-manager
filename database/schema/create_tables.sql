-- Tables
CREATE TABLE players
(
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    firstname  VARCHAR(255) NOT NULL,
    birthdate  DATE,
    birthyear  INT2,
    position   VARCHAR,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedules
(
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    date       TIMESTAMP WITH TIME ZONE NOT NULL,
    location   VARCHAR(255),
    type       VARCHAR                  NOT NULL,
    matchtype  VARCHAR,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_engagements
(
    id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id            UUID REFERENCES players (id) ON DELETE CASCADE,
    schedule_id          UUID REFERENCES schedules (id) ON DELETE CASCADE,
    participation_status VARCHAR NOT NULL,
    manually_added       BOOLEAN     DEFAULT false,
    created_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)


-- Enable RLS (Test)
-- tst_players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- tst_players
ALTER TABLE public.player_engagements ENABLE ROW LEVEL SECURITY;

-- tst_players
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;


-- Policies
-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.players
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.players
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.players
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.players
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.player_engagements
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.player_engagements
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.player_engagements
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.player_engagements
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.schedules
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.schedules
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.schedules
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.schedules
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');
