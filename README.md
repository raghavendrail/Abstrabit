📌 Smart Bookmark App

Live URL:
👉 https://abstrabit-a28w.vercel.app/

🚀 Overview

Smart Bookmark App is a full-stack bookmark manager built using Next.js (App Router) and Supabase.

The application allows users to:

Sign in using Google OAuth

Add bookmarks (URL + title)

View private bookmarks

Edit bookmarks

Delete bookmarks

Experience real-time updates across multiple tabs

The application is fully deployed on Vercel and uses Supabase Realtime for instant synchronization.

🛠 Tech Stack
Frontend

Next.js 16 (App Router)

React (JavaScript)

Tailwind CSS

Backend (BaaS)

Supabase

Google OAuth Authentication

PostgreSQL Database

Realtime subscriptions (WebSocket)

Row Level Security (RLS)

Deployment

Vercel

🔐 Authentication

Google OAuth only (no email/password login)

Secure session handling via Supabase Auth

Proper redirect handling for:

Local development

Production (Vercel)

🗄 Database Design
Table: bookmarks
Column	Type	Description
id	uuid	Primary key
user_id	uuid	References auth.users
title	text	Bookmark title
url	text	Bookmark URL
created_at	timestamp	Auto-generated
🔒 Security (Row Level Security - RLS)

RLS is enabled on the bookmarks table.

Policies implemented:

Users can only SELECT their own bookmarks

Users can only INSERT their own bookmarks

Users can only UPDATE their own bookmarks

Users can only DELETE their own bookmarks

This ensures full data isolation between users.

⚡ Realtime Implementation

Supabase Realtime is used to sync changes instantly across multiple browser tabs.

Implemented using:

supabase.channel("bookmarks-channel")
  .on("postgres_changes", { event: "*" })
  .subscribe()


Supported realtime events:

INSERT

UPDATE

DELETE

Behavior:

Add in Tab A → appears instantly in Tab B

Edit in Tab A → updates instantly in Tab B

Delete in Tab A → removed instantly in Tab B

No manual refresh required.

🎯 Features

✅ Google OAuth Login

✅ Add Bookmark

✅ Edit Bookmark

✅ Delete Bookmark

✅ Private per-user data

✅ Real-time updates across tabs

✅ Optimistic UI updates

✅ Fully deployed on Vercel

🧠 Architecture

Browser (Client)
↓
Next.js (App Router)
↓
Supabase
├── Auth (Google OAuth)
├── PostgreSQL Database
└── Realtime WebSocket

⚙️ Local Setup

Clone repository

git clone https://github.com/raghavendrail/Abstrabit.git


Install dependencies

npm install


Create .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key


Run development server

npm run dev

🚀 Deployment

Deployed using Vercel.

Environment variables configured in Vercel:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Production URL:
👉 https://abstrabit-a28w.vercel.app/

🛑 Problems Faced & Solutions
1️⃣ OAuth Redirect Issue

Problem: redirect_uri_mismatch
Solution: Correctly configured Google OAuth callback to Supabase.

2️⃣ Realtime Not Working for Update/Delete

Problem: Only INSERT events were working.
Solution: Updated Supabase supabase_realtime publication to include:

insert, update, delete

3️⃣ Vercel Build Failure (supabaseUrl is required)

Problem: Environment variables not set in Vercel.
Solution: Added environment variables in Vercel project settings.

4️⃣ Production Redirect to localhost

Problem: Hardcoded redirect URL.
Solution: Used:

redirectTo: `${window.location.origin}/dashboard`

📌 Assignment Requirements Checklist
Requirement	Status
Google OAuth login	✅
Add bookmark	✅
Private per-user bookmarks	✅
Realtime updates	✅
Delete own bookmarks	✅
Deployed on Vercel	✅

All requirements successfully implemented.

👨‍💻 Author

Raghavendra IL
