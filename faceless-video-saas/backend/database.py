"""
Database configuration and models
"""
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import VideoStatus

# Database URL from environment or default to SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./faceless_video.db"
)

# Handle Render's PostgreSQL URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={} if DATABASE_URL.startswith("postgresql") else {"check_same_thread": False},
    pool_pre_ping=True,
    pool_recycle=300
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


class VideoDB(Base):
    """Video model for database"""
    __tablename__ = "videos"
    
    id = Column(String(36), primary_key=True, index=True)
    topic = Column(String(200), nullable=False, index=True)
    status = Column(SQLEnum(VideoStatus), default=VideoStatus.PENDING, index=True)
    progress = Column(Integer, default=0)
    script = Column(Text, nullable=True)
    audio_path = Column(String(500), nullable=True)
    video_path = Column(String(500), nullable=True)
    thumbnail_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    error_message = Column(Text, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "status": self.status.value if self.status else None,
            "progress": self.progress,
            "script": self.script,
            "audio_url": f"/media/{os.path.basename(self.audio_path)}" if self.audio_path else None,
            "video_url": f"/media/{os.path.basename(self.video_path)}" if self.video_path else None,
            "thumbnail_url": f"/media/{os.path.basename(self.thumbnail_path)}" if self.thumbnail_path else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "error_message": self.error_message
        }


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
