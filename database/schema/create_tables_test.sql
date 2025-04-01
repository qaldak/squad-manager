-- Tables (Test)
CREATE TABLE tst_players
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

CREATE TABLE tst_schedules
(
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    date       TIMESTAMP WITH TIME ZONE NOT NULL,
    location   VARCHAR(255),
    type       VARCHAR                  NOT NULL,
    matchtype  VARCHAR,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tst_player_engagements
(
    id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id            UUID REFERENCES tst_players (id) ON DELETE CASCADE,
    schedule_id          UUID REFERENCES tst_schedules (id) ON DELETE CASCADE,
    participation_status VARCHAR NOT NULL,
    manually_added       BOOLEAN     DEFAULT false,
    created_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)


-- Enable RLS (Test)
-- tst_players
ALTER TABLE public.tst_players ENABLE ROW LEVEL SECURITY;

-- tst_players
ALTER TABLE public.tst_player_engagements ENABLE ROW LEVEL SECURITY;

-- tst_players
ALTER TABLE public.tst_schedules ENABLE ROW LEVEL SECURITY;


-- Policies (Test)
-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.tst_players
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.tst_players
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.tst_players
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.tst_players
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.tst_player_engagements
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.tst_player_engagements
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.tst_player_engagements
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.tst_player_engagements
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to read all records
CREATE POLICY "Allow all authenticated users to select"
ON public.tst_schedules
FOR SELECT
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to update all records
CREATE POLICY "Allow all authenticated users to update"
ON public.tst_schedules
FOR UPDATE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to delete all data records
CREATE POLICY "Allow all authenticated users to delete"
ON public.tst_schedules
FOR DELETE
USING (( SELECT auth.role() AS role) = 'authenticated');

-- Allows authenticated users to create records
CREATE POLICY "Allow all authenticated users to insert"
ON public.tst_schedules
FOR INSERT
WITH CHECK (( SELECT auth.role() AS role) = 'authenticated');
