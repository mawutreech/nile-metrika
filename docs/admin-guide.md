# Nile Metrica Admin Guide

## Overview

Nile Metrica includes an admin system for managing:

- Publications
- Datasets
- Indicators
- Indicator values

The admin supports:

- Role-based access
- File uploads
- Audit tracking
- Search and pagination
- CSV import for indicator values

---

## User roles

### Admin
Can:

- Create
- Edit
- Delete
- Upload files
- Manage indicator values
- Import indicator CSVs

### Editor
Can:

- Create
- Edit
- Upload files
- Manage indicator values
- Import indicator CSVs

Cannot:

- Delete records

### Viewer
Can:

- View admin list pages

Cannot:

- Create
- Edit
- Delete
- Upload
- Import

---

## How to add a user

### Step 1: create the user
In Supabase:

- Go to **Authentication**
- Create a new user with email and password

### Step 2: assign a role
Go to **Table Editor** → `profiles`

Find the user row and set the `role` column to one of:

- `admin`
- `editor`
- `viewer`

If needed, use SQL:

```sql
insert into public.profiles (id, email, role)
select id, email, 'editor'
from auth.users
where email = 'user@example.com'
on conflict (id) do update
set role = excluded.role,
    email = excluded.email;