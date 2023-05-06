-- Setup database

-- Install uuid-ossp module to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create groups table
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
