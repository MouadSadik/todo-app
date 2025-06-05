CREATE TABLE profiles (
  id uuid PRIMARY KEY references auth.users(id) ON DELETE CASCADE,
   full_name text,
   avatar_url text,
   created_at timestamp with time zone DEFAULT now()
)

CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    is_completed boolean DEFAULT false,
    priority integer DEFAULT 3,
    due_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
)

CREATE INDEX idx_tasks_user_id ON tasks(user_id);