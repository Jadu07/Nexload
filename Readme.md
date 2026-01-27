# Nexload

Nexload is a platform where developers can upload and download free resources for web development. Think templates, design assets, eBooks, tools, basically anything that might help other developers. It’s built to make sharing simple and discovering useful resources faster, all in one place.
The goal is to support the developer community by encouraging open sharing and collaboration.

<img width="1495" height="860" alt="Screenshot 2026-01-28 at 12 05 51 AM" src="https://github.com/user-attachments/assets/27ea3f77-d9f4-45fd-a0fc-11ccb7ad1f83" />

## Quick Start

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
```

Run the migrations:
```bash
npx prisma db push
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Start the dev server:
```bash
npm run dev
```

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Supabase (for file storage)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL (via Supabase)

## Features

- Upload resources with images and metadata
- Search functionality
- Category filtering
- Download tracking
- Responsive design

## Project Structure

```
nexload/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── config/
│   └── package.json
├── backend/           # Express API
│   ├── prisma/
│   ├── server.js
│   └── package.json
└── README.md
```

## Database Schema

The main table is `resources`:
- id, title, description
- category, tags (array)
- image_url, file_url
- downloads, author
- created_at

