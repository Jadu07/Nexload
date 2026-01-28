# Google OAuth Deployment Setup

## Important: Update Google OAuth Console

When deploying to production, you **MUST** add the production URLs to your Google Cloud Console:

### 1. Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

### 2. Select your OAuth 2.0 Client ID

### 3. Add Authorized Redirect URIs:
- **Production Backend**: `https://nexload-backend2.vercel.app/auth/google/callback`
- **Local Development**: `http://localhost:3000/auth/google/callback`

### 4. Add Authorized JavaScript Origins:
- **Production Frontend**: `https://nexload.vercel.app`
- **Production Backend**: `https://nexload-backend2.vercel.app`
- **Local Frontend**: `http://localhost:5173`
- **Local Backend**: `http://localhost:3000`

## Environment Variables for Vercel Deployment

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=your_supabase_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
BACKEND_URL=https://nexload-backend2.vercel.app
FRONTEND_URL=https://nexload.vercel.app
```

## Note
- The backend code now automatically uses `BACKEND_URL` for OAuth callback
- Make sure to save changes in Google Cloud Console before deploying
