# 📘 Memory App – README

A simple, elegant React Native (Expo) application that allows users to create, store, and view personal memories, including photos, titles, and descriptions.
This project uses Supabase for backend database, authentication, and storage.

## loom video link : https://www.loom.com/share/9ad84c21a4744bc88a33af4cba77f6d8

## 🚀 Features

- Create a memory with image, title, and description
- Upload images to Supabase Storage
- View all saved memories
- Clean architecture using custom hooks and service modules
- Strong focus on clarity, maintainability, and scalability

## 🛠️ Tech Stack

Frontend

- React Native (Expo)
- Expo Image (cached image)
- TypeScript
- Custom components + modular UI system

Backend

- Supabase (Database + Storage + RLS)

## 🧰 Supabase Setup (Client Requirement)

### 1. Create Your Own Supabase Project

Create a new Supabase project at https://supabase.com/dashboard

Free tier is enough.

### 📦 2. Database Schema

Table: `memories`

```sql
create table public.memories (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text not null,
  created_at timestamp with time zone default now()
);
```

Why this structure?

- Simple enough for CRUD memory operations
- `image_url` stores the public URL from Supabase Storage
- `id` uses UUID for scalability
- Timestamps allow sorting, future filtering, analytics

### 🗂️ 3. Storage Bucket Setup

- Bucket Name: `memories`
- Bucket Type: public

Reason → Images should load directly in the mobile app without requiring signed URLs. This keeps the client-side logic simple and improves performance.

### 🔒 4. RLS Policies

Enable RLS on the `memories` table:

```sql
alter table public.memories enable row level security;
```

RLS Policy: Allow Full Access (Public Demo App)

Since this app does NOT use authentication (as per task scope), create simple open policies:

```sql
create policy "Allow public read" on public.memories
for select using (true);

create policy "Allow public insert" on public.memories
for insert with check (true);
```

Why this?

- Keeps the task simple
- No authentication flow needed
- Reviewer can test easily

Production apps would use `auth.uid()` and restrict rows per user — but this is intentionally excluded based on task requirements.

## 📁 Folder Structure Overview

```
/app
  /components
  /constants
  /hooks
  /services
  /screens
  /utils
README.md
```

Key architectural choices

- services/ → Supabase API integration (upload + insert)
- hooks/ → Reusable logic (`uploadMemory`, `fetchMemories`, `pickImage`)
- components/ → Pure UI components (`Button`, `Input`, `CachedImage`, `MemoryCard`)
- constants/ → Colors, spacing, typography, URLs, storage bucket names
- screens/ → Feature-level screens

## 📤 Image Upload Flow

1. Select Image
2. Upload to Supabase Storage (via Axios or Supabase client)
3. Receive storage path + construct public URL
4. Save metadata to `memories` table
5. Navigate to success screen

This is implemented inside:

- `services/memoryService.ts`
- `hooks/useUploadMemory.ts`

## 💾 Example Env Setup

Create a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

And access via:

```js
process.env.EXPO_PUBLIC_SUPABASE_URL;
```

## 📲 Running the App

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

## Improvement points

1. Add Delete Memory Feature

2. Improve UI Design & Visual Polish

3. Add memory type so we can filter it out
