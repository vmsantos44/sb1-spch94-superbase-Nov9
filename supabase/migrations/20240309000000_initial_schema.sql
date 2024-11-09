-- Enable Row Level Security
create extension if not exists "uuid-ossp";

-- Employees Table
create table if not exists public.employees (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    employee_id text not null unique,
    name text not null,
    email text not null unique,
    position text not null,
    salary numeric not null,
    tax_id text not null unique,
    department text not null,
    employment_type text not null check (employment_type in ('Full Time', 'Part Time', 'Contractor', 'Estagiário(a)')),
    join_date date not null,
    termination_date date,
    status text not null default 'active' check (status in ('active', 'archived')),
    archive_reason text,
    work_location text,
    bank_name text,
    bank_account text,
    address text,
    country text,
    food_allowance numeric default 6500,
    communication_allowance numeric default 3500,
    attendance_bonus numeric default 5000,
    assiduity_bonus numeric default 5000
);

-- Salary Adjustments Table
create table if not exists public.salary_adjustments (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    employee_id uuid references public.employees(id) on delete cascade,
    type text not null check (type in ('bonus', 'deduction')),
    amount numeric not null,
    description text not null,
    date date not null,
    pay_period text,
    processed boolean default false
);

-- Time Entries Table
create table if not exists public.time_entries (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    employee_id uuid references public.employees(id) on delete cascade,
    date date not null,
    status text not null check (status in ('regular', 'absent', 'dayoff', 'holiday', 'vacation', 'sick', 'incomplete', 'remote', 'justified', 'halfday')),
    clock_in time,
    clock_in_description text,
    clock_out time,
    clock_out_description text,
    total_work integer not null, -- in minutes
    total_break integer not null, -- in minutes
    total_overtime integer not null, -- in minutes
    edited boolean default false,
    edited_by uuid references auth.users(id),
    note text,
    justification text,
    unique(employee_id, date)
);

-- Payroll History Table
create table if not exists public.payroll_history (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    month text not null,
    processed_date timestamp with time zone not null,
    status text not null check (status in ('processing', 'processed', 'error')),
    total_gross numeric not null,
    total_deductions numeric not null,
    total_net numeric not null,
    processed_by uuid references auth.users(id),
    notes text
);

-- Enable Row Level Security (RLS)
alter table public.employees enable row level security;
alter table public.salary_adjustments enable row level security;
alter table public.time_entries enable row level security;
alter table public.payroll_history enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.employees
    for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.employees
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.employees
    for update using (auth.role() = 'authenticated');

-- Repeat similar policies for other tables
create policy "Enable read access for authenticated users" on public.salary_adjustments
    for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.salary_adjustments
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.salary_adjustments
    for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.time_entries
    for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.time_entries
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.time_entries
    for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.payroll_history
    for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.payroll_history
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.payroll_history
    for update using (auth.role() = 'authenticated');