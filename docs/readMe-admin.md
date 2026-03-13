## 2. `README-admin-section.md`

```md
## Admin Guide

Nile Metrica includes a role-based admin for managing publications, datasets, indicators, and indicator values.

### Roles

- **Admin**: full access
- **Editor**: create/edit/upload/import, but cannot delete
- **Viewer**: read-only

### Admin routes

- `/admin`
- `/admin/publications`
- `/admin/datasets`
- `/admin/indicators`
- `/admin/indicators/[id]/values`
- `/admin/indicators/[id]/values/import`

### Main features

- CRUD for publications, datasets, and indicators
- File uploads for publications and datasets
- Manual and CSV import for indicator values
- Search and pagination in admin lists
- Audit fields: `created_by`, `updated_by`, `created_at`, `updated_at`
- Success and error banners
- Row Level Security (RLS) enforced in Supabase

### Add a user

1. Create the user in **Supabase Authentication**
2. Set their role in the `profiles` table to one of:
   - `admin`
   - `editor`
   - `viewer`

### Indicator CSV import format

```csv
year,value,date,geography
2020,12.4,2020-01-01,Juba
2021,13.1,2021-01-01,Juba
2022,14.0,2022-01-01,Wau