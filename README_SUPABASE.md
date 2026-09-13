# SettleEase Backend - Supabase Integration

This project is now powered by [Supabase](https://supabase.com/) (PostgreSQL + Auth).

## 🚀 Setup Instructions

1.  **Create Supabase Project**
    -   Go to [supabase.com](https://supabase.com) and create a new project.

2.  **Environment Variables**
    -   Copy `.env` to `.env.local` (if not exists).
    -   Update the following keys from your Supabase Project Settings -> API:
        ```env
        VITE_SUPABASE_URL=your_project_url
        VITE_SUPABASE_ANON_KEY=your_anon_key
        ```

3.  **Setup Database (SQL)**
    -   Go to the **SQL Editor** in your Supabase Dashboard.
    -   Open `supabase/schema.sql` from this project.
    -   **Run** the entire script.
    -   *This will create tables (services, profiles, etc.), enable RLS policies, and seed initial data.*

4.  **Run Application**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

-   `src/lib/supabase.ts`: Supabase client initialization.
-   `src/services/`:
    -   `auth.ts`: Authentication logic (Sign Up, Login, Get User).
    -   `api.ts`: Data fetching (Services, Chat, Requirements).
-   `src/components/convex-examples/`:
    -   `ServicesList.tsx`: Demonstrates fetching data from `services` table.
    -   `Chat.tsx`: Demonstrates chat history and inserting messages.

## 🔐 Authentication

-   Users must sign up/login to save data (chat, requirements).
-   **Anonymous**: Public data (Services, Emergency Contacts) is readable without login due to RLS policies.
-   Chat requires login (handled in `Chat.tsx` via a placeholder alert/flow).

## 🗄️ Database Tables (created by schema.sql)

-   `profiles`: Users data (syncs with Auth).
-   `services`: PGs, Tiffins, etc.
-   `requirements`: User posted needs.
-   `emergency_contacts`: Police, Hospital data.
-   `languages`: Helper phrases.
-   `chat_history`: Stores user and bot messages.
