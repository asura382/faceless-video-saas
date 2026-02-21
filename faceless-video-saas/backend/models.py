"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class VideoStatus(str, Enum):
    PENDING = "pending"
    GENERATING_SCRIPT = "generating_script"
    GENERATING_VOICE = "generating_voice"
    FETCHING_CLIPS = "fetching_clips"
    RENDERING = "rendering"
    COMPLETED = "completed"
    FAILED = "failed"


class VideoCreateRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200, description="Video topic")
    duration: int = Field(default=60, ge=30, le=180, description="Video duration in seconds")
    style: Optional[str] = Field(default="engaging", description="Video style")
    
    class Config:
        json_schema_extra = {
            "example": {
                "topic": "10 Amazing Facts About Space",
                "duration": 60,
                "style": "engaging"
            }
        }


class VideoResponse(BaseModel):
    id: str
    topic: str
    status: VideoStatus
    progress: int = Field(default=0, ge=0, le=100)
    script: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


class VideoListResponse(BaseModel):
    videos: List[VideoResponse]
    total: int


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
