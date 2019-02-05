SET timezone = 'UTC'

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  name VARCHAR(280) NOT NULL,
  order_num INTEGER,
  completed_at TIMESTAMPTZ,
  details VARCHAR(1024),
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

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO me;

GRANT USAGE, SELECT ON SEQUENCE todos_id_seq TO me;

-- INSERT INTO todos (name, details, completed_at) VALUES ('hey', 'lipsum', '2019-01-25T00:53:52Z');