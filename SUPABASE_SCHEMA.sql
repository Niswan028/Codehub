-- Create the solutions table
create table public.solutions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  problem_name text not null,
  difficulty text not null,
  topic text not null,
  pattern text not null,
  time_complexity text not null,
  space_complexity text not null,
  key_points jsonb not null,
  user_trick text not null,
  approach_summary text not null,
  code text not null,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable Row Level Security
alter table public.solutions enable row level security;

-- Allow users to access their own rows only
create policy "Users can manage their own solutions" on public.solutions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
