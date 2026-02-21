# Faceless Video SaaS - Deployment Guide

Complete deployment instructions for the Faceless Video generation platform.

## Architecture

- **Frontend**: Next.js 14 (Vercel Free Tier)
- **Backend**: FastAPI + FFmpeg (Render Free Tier)
- **Database**: PostgreSQL (Render Free Tier)
- **AI Services**: HuggingFace Inference API (Free), gTTS (Free), Pexels (Free)

---

## Prerequisites

1. GitHub account
2. Render account (https://render.com)
3. Vercel account (https://vercel.com)
4. HuggingFace account (https://huggingface.co)
5. Pexels account (https://pexels.com)

---

## Step 1: Get Free API Keys

### HuggingFace Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "read" access
3. Copy the token (starts with `hf_`)

### Pexels API Key
1. Go to https://www.pexels.com/api/
2. Sign up and request API access
3. Copy your API key

### Pixabay API Key (Optional Fallback)
1. Go to https://pixabay.com/api/docs/
2. Sign up and get your API key

---

## Step 2: Deploy Backend to Render

### 2.1 Create PostgreSQL Database

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - Name: `faceless-video-db`
   - Database: `faceless_video`
   - User: `faceless_user`
   - Plan: **Free**
3. Click "Create Database"
4. Copy the "Internal Database URL" (you'll need this)

### 2.2 Deploy Web Service

1. Push your code to GitHub
2. In Render Dashboard, click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `faceless-video-api`
   - Runtime: `Docker`
   - Plan: **Free**
   - Branch: `main`
   - Root Directory: `backend`

5. Add Environment Variables:
   ```
   DATABASE_URL=<your-postgres-internal-url>
   HUGGINGFACE_TOKEN=<your-hf-token>
   PEXELS_API_KEY=<your-pexels-key>
   PIXABAY_API_KEY=<your-pixabay-key> (optional)
   FRONTEND_URL=<your-vercel-url-after-deployment>
   ```

6. Click "Create Web Service"

7. Wait for deployment (5-10 minutes)

8. Copy your service URL: `https://faceless-video-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy

1. Push your code to GitHub (same repo or separate)
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://faceless-video-api.onrender.com
   ```

7. Click "Deploy"

8. Wait for deployment (2-3 minutes)

9. Your frontend is live! Copy the URL.

---

## Step 4: Update CORS (Important!)

1. Go back to Render Dashboard
2. Open your web service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://faceless-video-xyz.vercel.app
   ```
5. The service will auto-redeploy

---

## Project Structure

```
faceless-video-saas/
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── models.py               # Pydantic models
│   ├── database.py             # Database config
│   ├── requirements.txt        # Python deps
│   ├── Dockerfile              # Container config
│   └── services/
│       ├── script_service.py   # HuggingFace integration
│       ├── tts_service.py      # gTTS integration
│       ├── stock_service.py    # Pexels/Pixabay integration
│       └── video_service.py    # FFmpeg processing
│   └── utils/
│       └── subtitle_generator.py
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── VideoPlayer.tsx
│   │   └── ProgressBar.tsx
│   ├── services/
│   │   └── api.ts              # API client
│   ├── lib/
│   │   └── utils.ts            # Utilities
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── DEPLOYMENT.md               # This file
```

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# AI Services
HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx
PEXELS_API_KEY=xxxxxxxxxxxxxxxx
PIXABAY_API_KEY=xxxxxxxxxxxxxxxx (optional)

# CORS
FRONTEND_URL=https://your-app.vercel.app

# Optional
DEBUG=false
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

---

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set env vars
export HUGGINGFACE_TOKEN=your_token
export PEXELS_API_KEY=your_key

# Run
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/videos` | Create new video |
| GET | `/api/videos` | List all videos |
| GET | `/api/videos/{id}` | Get video status |
| DELETE | `/api/videos/{id}` | Delete video |
| GET | `/api/videos/{id}/download` | Download video |
| GET | `/media/{filename}` | Serve media files |

---

## Rate Limits (Free Tiers)

| Service | Limit |
|---------|-------|
| HuggingFace Inference | ~1000 requests/day |
| Pexels API | 200 requests/hour |
| Pixabay API | 100 requests/minute |
| Render Web Service | 750 hours/month |
| Render PostgreSQL | 1GB storage |
| Vercel | 100GB bandwidth/month |

---

## Troubleshooting

### Video Generation Stuck
- Check Render logs for errors
- HuggingFace model might be loading (can take 30s-1min)
- Retry the request

### CORS Errors
- Verify `FRONTEND_URL` env var is set correctly
- Include `https://` prefix
- No trailing slash

### FFmpeg Not Found
- Ensure Dockerfile has `RUN apt-get install -y ffmpeg`
- Check Render deployment logs

### Database Connection Failed
- Verify `DATABASE_URL` format
- Use Internal Database URL for Render services
- Format: `postgresql://user:password@host:5432/dbname`

### Out of Memory
- Reduce video duration (max 180s on free tier)
- Lower resolution in video_service.py
- Use fewer stock clips

---

## Security Considerations

1. **Never commit API keys** - Use environment variables
2. **Add rate limiting** - Consider adding slowapi for production
3. **Validate inputs** - All inputs are validated with Pydantic
4. **File cleanup** - Temp files are cleaned after processing
5. **CORS restrictions** - Only allow your frontend domain

---

## Scaling (When Ready)

To upgrade from free tier:

1. **Render**: Upgrade to Starter ($7/month)
2. **Vercel**: Pro plan ($20/month)
3. **HuggingFace**: Use Inference Endpoints for dedicated capacity
4. **Database**: Upgrade Render PostgreSQL

---

## Support

For issues:
1. Check Render logs
2. Check Vercel deployment logs
3. Verify all environment variables
4. Test API with curl/Postman

---

## License

MIT - Free to use and modify.
