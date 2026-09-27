CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS observations(id uuid PRIMARY KEY,case_id uuid NOT NULL,source_type text NOT NULL,source_provider text,observed_at timestamptz NOT NULL,geom geography(Point,4326) NOT NULL,accuracy_m numeric,confidence numeric,legal_basis_id uuid,hash_sha256 text);
CREATE INDEX IF NOT EXISTS observations_geom_idx ON observations USING GIST(geom);
