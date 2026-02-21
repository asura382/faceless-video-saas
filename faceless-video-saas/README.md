# Faceless Video SaaS

A complete, production-ready web application for generating AI-powered faceless videos using only free APIs and services.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)

## Features

- **AI Script Generation** - Uses HuggingFace Inference API (free tier)
- **Text-to-Speech** - Uses gTTS (Google Text-to-Speech, completely free)
- **Stock Footage** - Fetches from Pexels & Pixabay (free tiers)
- **Auto Subtitles** - Generates and burns SRT subtitles
- **9:16 Format** - Optimized for TikTok, Reels, Shorts
- **Video History** - Save and manage all your videos
- **Download MP4** - Export final videos

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **FFmpeg** - Video processing and encoding
- **PostgreSQL/SQLite** - Database
- **Docker** - Containerization

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### AI Services (All Free)
- **HuggingFace Inference API** - Script generation
- **gTTS** - Text-to-speech
- **Pexels API** - Stock videos
- **Pixabay API** - Stock videos (fallback)

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd faceless-video-saas
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Run locally
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Run locally
npm run dev
```

### 4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/videos` | Create new video |
| GET | `/api/videos` | List videos |
| GET | `/api/videos/{id}` | Get video status |
| DELETE | `/api/videos/{id}` | Delete video |
| GET | `/api/videos/{id}/download` | Download video |

## Video Pipeline

```
User Topic
    ↓
AI Script Generation (HuggingFace)
    ↓
Text-to-Speech (gTTS)
    ↓
Stock Video Fetching (Pexels/Pixabay)
    ↓
Subtitle Generation
    ↓
Video Rendering (FFmpeg)
    ↓
Final MP4 Download
```

## Project Structure

```
faceless-video-saas/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Pydantic models
│   ├── database.py             # Database configuration
│   ├── Dockerfile              # Docker configuration
│   ├── requirements.txt        # Python dependencies
│   └── services/
│       ├── script_service.py   # AI script generation
│       ├── tts_service.py      # Text-to-speech
│       ├── stock_service.py    # Stock video fetching
│       └── video_service.py    # FFmpeg video processing
│
├── frontend/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   ├── services/               # API client
│   └── lib/                    # Utilities
│
└── DEPLOYMENT.md               # Deployment guide
```

## Environment Variables

### Backend
```env
DATABASE_URL=sqlite:///./faceless_video.db
HUGGINGFACE_TOKEN=hf_xxx
PEXELS_API_KEY=xxx
PIXABAY_API_KEY=xxx
FRONTEND_URL=http://localhost:3000
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Free Tier Limits

| Service | Free Limit |
|---------|------------|
| HuggingFace Inference | ~1000 req/day |
| Pexels API | 200 req/hour |
| Pixabay API | 100 req/min |
| Render Web | 750 hrs/month |
| Render PostgreSQL | 1GB storage |
| Vercel | 100GB bandwidth |

## Screenshots

### Create Video
![Create](https://via.placeholder.com/800x400?text=Create+Video+Interface)

### Progress Tracking
![Progress](https://via.placeholder.com/800x400?text=Progress+Tracking)

### Video History
![History](https://via.placeholder.com/800x400?text=Video+History)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md)
2. Review the troubleshooting section
3. Open a GitHub issue

---

Built with ❤️ using free AI services and open-source tools.
