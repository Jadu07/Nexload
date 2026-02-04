# Nexload

Nexload is a community-driven platform for developers to share and discover free web development resources. From templates and design assets to eBooks and tools, Nexload makes it easy to find what you need to build your next project.

<img width="1495" height="860" alt="Nexload Screenshot" src="https://github.com/user-attachments/assets/27ea3f77-d9f4-45fd-a0fc-11ccb7ad1f83" />

## Features

### 🎨 User Interface
- **Modern & Responsive Design**: Built with React and Tailwind CSS for a seamless experience across all devices.
- **Dynamic Hero Section**: Features a powerful search bar to quickly find resources.
- **Category Browsing**: dedicated pages for Templates, Books, Icons, Tools, Fonts, Themes, Plugins, and Graphics.
- **User Dashboard**: Profile management with upload history.

### 🚀 Core Functionality
- **Resource Management**:
  - **Upload Resources**: Share your work with a title, description, category, tags, cover image, and file.
  - **Edit Capabilities**: Update your existing uploads.
  - **Download Tracking**: Monitor community engagement with your resources.
- **Smart Search**: Real-time search functionality to find specific assets.
- **Authentication**: Secure Google Login integration.

## Tech Stack

**Frontend**
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: React Router DOM

**Backend**
- **Server**: Node.js + Express
- **Database ORM**: Prisma
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage (for images and file assets)

## Project Structure

```
nexload/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Components (Navbar, Hero, UploadPopup, etc.)
│   │   ├── config/          # API & Supabase configuration
│   │   ├── App.jsx          # Main application & routing
│   │   └── main.jsx         # Entry point
│   └── package.json
├── backend/
│   ├── prisma/              # Database schema & migrations
│   ├── server.js            # Express server entry point
│   └── package.json
└── README.md
```

## Getting Started

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
```

Run database migrations:

```bash
npx prisma db push
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Start the frontend development server:

```bash
npm run dev
```

## Usage

1. **Login**: Click the "Login" button in the navbar to sign in with Google.
2. **Upload**: Once logged in, use the "Upload" button to share a new resource. You'll need to provide a title, description, category, and upload both a cover image and the resource file.
3. **Browse & Search**: Use the search bar on the home page or click on categories to filter resources.
4. **Profile**: Access your profile to view and manage your uploaded resources.
