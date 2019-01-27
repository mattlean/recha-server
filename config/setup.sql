SET timezone = 'UTC'

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(280) NOT NULL,
  text VARCHAR(1024),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO me;

-- GRANT USAGE, SELECT ON SEQUENCE todos_id_seq TO me;

-- INSERT INTO todos (name, text, completed_at) VALUES ('hey', 'lipsum', '2019-01-25T00:53:52Z');