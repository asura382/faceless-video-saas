"""
Faceless Video SaaS - Main FastAPI Application
"""
import os
import uuid
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

# Import models and database
from models import (
    VideoCreateRequest, 
    VideoResponse, 
    VideoListResponse,
    HealthResponse,
    ErrorResponse,
    VideoStatus
)
from database import init_db, get_db, VideoDB

# Import services
from services.script_service import script_service
from services.tts_service import tts_service
from services.stock_service import stock_service
from services.video_service import video_service
from utils.subtitle_generator import subtitle_generator

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEDIA_DIR = "/app/media"
os.makedirs(MEDIA_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    logger.info("Starting up Faceless Video API...")
    init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Faceless Video API",
    description="AI-powered faceless video generation API using free services",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi.responses import Response

@app.options("/{full_path:path}")
async def preflight_handler(full_path: str):
    return Response(status_code=200)
# Mount media files
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


# ============================================================================
# Health Check
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow()
    )


# ============================================================================
# Video Generation Endpoints
# ============================================================================

@app.post("/api/videos", response_model=VideoResponse)
async def create_video(
    request: VideoCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new video from topic
    
    This endpoint initiates the video generation process:
    1. Generates script using HuggingFace
    2. Converts script to audio using gTTS
    3. Fetches stock videos from Pexels/Pixabay
    4. Renders final video with FFmpeg
    """
    try:
        # Generate unique ID
        video_id = str(uuid.uuid4())
        
        # Create database entry
        video_db = VideoDB(
            id=video_id,
            topic=request.topic,
            status=VideoStatus.PENDING,
            progress=0
        )
        db.add(video_db)
        db.commit()
        
        logger.info(f"Created video job: {video_id}")
        
        # Start background processing
        background_tasks.add_task(
            process_video,
            video_id=video_id,
            topic=request.topic,
            duration=request.duration
        )
        
        return VideoResponse(
            id=video_id,
            topic=request.topic,
            status=VideoStatus.PENDING,
            progress=0,
            created_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error creating video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, db: Session = Depends(get_db)):
    """Get video status and details"""
    video = db.query(VideoDB).filter(VideoDB.id == video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return VideoResponse(
        id=video.id,
        topic=video.topic,
        status=VideoStatus(video.status) if video.status else VideoStatus.PENDING,
        progress=video.progress,
        script=video.script,
        audio_url=video.to_dict().get("audio_url"),
        video_url=video.to_dict().get("video_url"),
        thumbnail_url=video.to_dict().get("thumbnail_url"),
        created_at=video.created_at,
        updated_at=video.updated_at,
        error_message=video.error_message
    )


@app.get("/api/videos", response_model=VideoListResponse)
async def list_videos(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List all videos with pagination"""
    videos = db.query(VideoDB).order_by(VideoDB.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(VideoDB).count()
    
    return VideoListResponse(
        videos=[VideoResponse(
            id=v.id,
            topic=v.topic,
            status=VideoStatus(v.status) if v.status else VideoStatus.PENDING,
            progress=v.progress,
            script=v.script,
            audio_url=v.to_dict().get("audio_url"),
            video_url=v.to_dict().get("video_url"),
            thumbnail_url=v.to_dict().get("thumbnail_url"),
            created_at=v.created_at,
            updated_at=v.updated_at,
            error_message=v.error_message
        ) for v in videos],
        total=total
    )


@app.delete("/api/videos/{video_id}")
async def delete_video(video_id: str, db: Session = Depends(get_db)):
    """Delete a video and its files"""
    video = db.query(VideoDB).filter(VideoDB.id == video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Delete files
    for path_attr in ['audio_path', 'video_path', 'thumbnail_path']:
        path = getattr(video, path_attr, None)
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                logger.warning(f"Failed to delete file {path}: {e}")
    
    # Delete database entry
    db.delete(video)
    db.commit()
    
    return {"message": "Video deleted successfully"}


@app.get("/api/videos/{video_id}/download")
async def download_video(video_id: str, db: Session = Depends(get_db)):
    """Download the final video file"""
    video = db.query(VideoDB).filter(VideoDB.id == video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    if video.status != VideoStatus.COMPLETED or not video.video_path:
        raise HTTPException(status_code=400, detail="Video not ready for download")
    
    if not os.path.exists(video.video_path):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    return FileResponse(
        video.video_path,
        media_type="video/mp4",
        filename=f"faceless_{video_id}.mp4"
    )


# ============================================================================
# Background Video Processing
# ============================================================================

async def process_video(video_id: str, topic: str, duration: int = 60):
    """
    Background task to process video generation
    
    Pipeline:
    1. Generate script (HuggingFace)
    2. Generate audio (gTTS)
    3. Fetch stock videos (Pexels/Pixabay)
    4. Create subtitles
    5. Render final video (FFmpeg)
    6. Generate thumbnail
    """
    from database import SessionLocal
    
    db = SessionLocal()
    video = None
    
    try:
        video = db.query(VideoDB).filter(VideoDB.id == video_id).first()
        if not video:
            logger.error(f"Video {video_id} not found")
            return
        
        # Step 1: Generate Script
        logger.info(f"[{video_id}] Step 1: Generating script...")
        video.status = VideoStatus.GENERATING_SCRIPT
        video.progress = 10
        db.commit()
        
        script_result = await script_service.generate_script(topic, duration)
        video.script = script_result["full_script"]
        scenes = script_result["scenes"]
        db.commit()
        
        logger.info(f"[{video_id}] Script generated: {script_result['word_count']} words")
        
        # Step 2: Generate Audio
        logger.info(f"[{video_id}] Step 2: Generating audio...")
        video.status = VideoStatus.GENERATING_VOICE
        video.progress = 25
        db.commit()
        
        audio_path = await tts_service.generate_audio_for_scenes(scenes, video_id)
        if audio_path:
            video.audio_path = audio_path
            db.commit()
            logger.info(f"[{video_id}] Audio generated")
        else:
            logger.error(f"[{video_id}] Failed to generate audio")
            raise Exception("Audio generation failed")
        
        # Step 3: Fetch Stock Videos
        logger.info(f"[{video_id}] Step 3: Fetching stock videos...")
        video.status = VideoStatus.FETCHING_CLIPS
        video.progress = 45
        db.commit()
        
        video_clips = await stock_service.fetch_videos_for_scenes(scenes, video_id)
        
        if not video_clips:
            logger.warning(f"[{video_id}] No stock videos found, using fallback")
            fallback = await stock_service.get_fallback_video(video_id)
            if fallback:
                video_clips = [{"local_path": fallback, "duration": 10}]
        
        logger.info(f"[{video_id}] Fetched {len(video_clips)} video clips")
        
        # Step 4: Generate Subtitles
        logger.info(f"[{video_id}] Step 4: Generating subtitles...")
        video.progress = 60
        db.commit()
        
        subtitle_path = subtitle_generator.generate_srt(video.script, video_id)
        logger.info(f"[{video_id}] Subtitles generated")
        
        # Step 5: Render Video
        logger.info(f"[{video_id}] Step 5: Rendering video...")
        video.status = VideoStatus.RENDERING
        video.progress = 75
        db.commit()
        
        final_video_path = await video_service.create_final_video(
            video_id=video_id,
            video_clips=video_clips,
            audio_path=audio_path,
            subtitle_path=subtitle_path,
            target_duration=duration
        )
        
        if final_video_path:
            video.video_path = final_video_path
            logger.info(f"[{video_id}] Video rendered successfully")
        else:
            raise Exception("Video rendering failed")
        
        # Step 6: Generate Thumbnail
        logger.info(f"[{video_id}] Step 6: Generating thumbnail...")
        video.progress = 90
        db.commit()
        
        thumbnail_path = await video_service.generate_thumbnail(final_video_path, video_id)
        if thumbnail_path:
            video.thumbnail_path = thumbnail_path
        
        # Complete
        video.status = VideoStatus.COMPLETED
        video.progress = 100
        db.commit()
        
        logger.info(f"[{video_id}] Video processing completed!")
        
        # Cleanup temp files
        await video_service.cleanup_temp_files(video_id)
        
    except Exception as e:
        logger.error(f"[{video_id}] Error processing video: {str(e)}")
        if video:
            video.status = VideoStatus.FAILED
            video.error_message = str(e)
            db.commit()
    finally:
        db.close()


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            code=f"HTTP_{exc.status_code}"
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            detail=str(exc) if os.getenv("DEBUG") else None,
            code="INTERNAL_ERROR"
        ).dict()
    )


# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
