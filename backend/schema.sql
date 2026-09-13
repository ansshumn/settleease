-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  name text,
  role text check (role in ('user', 'service_provider')),
  city text,
  created_at timestamptz default now()
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, city)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'city');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. SERVICES
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  area text not null,
  city text not null,
  price numeric not null,
  price_type text check (price_type in ('monthly', 'daily', 'per_visit')),
  contact_number text,
  rating numeric default 0,
  verified boolean default false,
  distance numeric, -- simplified for now
  created_at timestamptz default now()
);

-- 3. REQUIREMENTS
create table requirements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  area text not null,
  budget numeric not null,
  description text,
  timeline text,
  status text default 'open',
  created_at timestamptz default now()
);

-- 4. EMERGENCY CONTACTS
create table emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  pincode text not null,
  type text check (type in ('hospital', 'police', 'pharmacy')),
  name text not null,
  address text,
  phone text,
  created_at timestamptz default now()
);

-- 5. LANGUAGES
create table languages (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  english text,
  hindi text,
  tamil text,
  kannada text,
  bengali text,
  marathi text
);

-- 6. CHAT HISTORY
create table chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- can be null for anonymous if handled carefully, but usually auth required
  message text not null,
  sender text check (sender in ('user', 'bot')),
  created_at timestamptz default now()
);

-- RLS POLICIES (Row Level Security)
alter table profiles enable row level security;
alter table services enable row level security;
alter table requirements enable row level security;
alter table emergency_contacts enable row level security;
alter table languages enable row level security;
alter table chat_history enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Services are viewable by everyone" on services for select using (true);

create policy "Users can view own requirements" on requirements for select using (auth.uid() = user_id);
create policy "Users can insert own requirements" on requirements for insert with check (auth.uid() = user_id);

create policy "Emergency contacts are viewable by everyone" on emergency_contacts for select using (true);

create policy "Languages are viewable by everyone" on languages for select using (true);

create policy "Users can view own chat" on chat_history for select using (auth.uid() = user_id);
create policy "Users can insert own chat" on chat_history for insert with check (auth.uid() = user_id);

-- SEED DATA
insert into services (name, category, area, city, price, price_type, contact_number, rating, verified) values
('Comfort PG', 'pg', 'Koramangala', 'Bangalore', 8000, 'monthly', '9876543210', 4.5, true),
('Maa Tiffin', 'tiffin', 'Indiranagar', 'Bangalore', 120, 'per_visit', '9123456780', 4.2, true),
('Quick Plumber', 'plumber', 'HSR Layout', 'Bangalore', 300, 'per_visit', '9988776655', 4.0, true);

insert into emergency_contacts (pincode, type, name, address, phone) values
('560078', 'hospital', 'Apollo Hospital', 'JP Nagar', '102'),
('560078', 'police', 'JP Nagar Police Station', 'JP Nagar 6th Phase', '100');

insert into languages (category, english, hindi, tamil, kannada) values
('Greetings', 'Hello', 'Namaste', 'Vanakkam', 'Namaskara'),
('Shopping', 'How much?', 'Kitne ka?', 'Evvalavu?', 'Eshtu?');
