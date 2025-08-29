# FarmConnect Deployment Guide

## Render Deployment

### Prerequisites
1. Push your code to a GitHub repository
2. Create a Render account at https://render.com

### Environment Variables Setup
In your Render dashboard, add these environment variables:

**Required:**
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render default)
- `MONGODB_URI`: Your MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Your Firebase service account JSON (as string)
- `FIREBASE_DATABASE_URL`: Your Firebase database URL
- `JWT_SECRET`: A secure random string

**Optional:**
- `OPENAI_API_KEY`: For AI features
- `WEATHER_API_KEY`: For weather integration
- `CLIENT_URL`: Your deployed frontend URL

### Deployment Steps

1. **Connect Repository**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm run render-build`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Add Environment Variables**
   - Add all required environment variables listed above
   - **Important**: Firebase service account key should be the entire JSON as a string

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

### Firebase Service Account Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Copy the entire JSON content
4. In Render, set `FIREBASE_SERVICE_ACCOUNT_KEY` to this JSON string

### Troubleshooting

**Build Failures:**
- Check that all environment variables are set
- Ensure Firebase service account key is valid JSON
- Verify MongoDB connection string is correct

**Runtime Errors:**
- Check Render logs for specific error messages
- Ensure all required environment variables are present
- Verify Firebase configuration is correct

### Local Development
1. Copy `.env.example` to `.env`
2. Fill in your environment variables
3. Run `npm run install-all` to install dependencies
4. Run `npm run dev` for development mode
