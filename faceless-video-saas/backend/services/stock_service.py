"""
Stock video service using Pexels API (Free Tier)
"""
import os
import httpx
import asyncio
from typing import List, Optional, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pexels API (Free tier: 200 requests/hour)
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")
PEXELS_API_URL = "https://api.pexels.com/videos/search"

# Pixabay API (Free tier: 100 requests/minute) - Fallback
PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY", "")
PIXABAY_API_URL = "https://pixabay.com/api/videos/"

MEDIA_DIR = "/app/media"


class StockService:
    """Service for fetching free stock videos"""
    
    def __init__(self):
        self.pexels_headers = {"Authorization": PEXELS_API_KEY} if PEXELS_API_KEY else {}
        self.client = httpx.AsyncClient(timeout=30.0)
        os.makedirs(MEDIA_DIR, exist_ok=True)
    
    async def fetch_videos_for_scenes(
        self, 
        scenes: List[Dict], 
        video_id: str,
        orientation: str = "portrait",
        min_duration: int = 5
    ) -> List[Dict]:
        """
        Fetch stock videos for each scene
        
        Args:
            scenes: List of scene dicts with 'keywords' key
            video_id: Unique video ID
            orientation: 'portrait' (9:16) or 'landscape'
            min_duration: Minimum video duration in seconds
            
        Returns:
            List of video info dicts with local paths
        """
        videos = []
        
        for i, scene in enumerate(scenes):
            keywords = scene.get('keywords', ['video'])
            query = ' '.join(keywords[:2])  # Use top 2 keywords
            
            logger.info(f"Fetching video for scene {i+1}: {query}")
            
            # Try Pexels first
            video_info = await self._fetch_from_pexels(
                query, orientation, min_duration
            )
            
            # Fallback to Pixabay if Pexels fails
            if not video_info:
                video_info = await self._fetch_from_pixabay(
                    query, orientation, min_duration
                )
            
            if video_info:
                # Download the video
                local_path = await self._download_video(
                    video_info['url'], 
                    f"{video_id}_scene_{i+1}.mp4"
                )
                
                if local_path:
                    videos.append({
                        "scene_number": i + 1,
                        "query": query,
                        "local_path": local_path,
                        "duration": video_info.get('duration', 10),
                        "width": video_info.get('width', 1080),
                        "height": video_info.get('height', 1920),
                        "source": video_info.get('source', 'unknown')
                    })
                else:
                    logger.warning(f"Failed to download video for scene {i+1}")
            else:
                logger.warning(f"No video found for scene {i+1}: {query}")
            
            # Rate limiting - be nice to APIs
            await asyncio.sleep(0.5)
        
        return videos
    
    async def _fetch_from_pexels(
        self, 
        query: str, 
        orientation: str,
        min_duration: int
    ) -> Optional[Dict]:
        """Fetch video from Pexels API"""
        if not PEXELS_API_KEY:
            logger.warning("Pexels API key not configured")
            return None
        
        try:
            params = {
                "query": query,
                "orientation": orientation,
                "per_page": 5,
                "min_duration": min_duration
            }
            
            response = await self.client.get(
                PEXELS_API_URL,
                headers=self.pexels_headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                videos = data.get('videos', [])
                
                if videos:
                    # Get the first video with appropriate resolution
                    video = videos[0]
                    video_files = video.get('video_files', [])
                    
                    # Find best quality file (prefer HD, but not too large)
                    best_file = None
                    for vf in video_files:
                        if vf.get('quality') in ['hd', 'sd']:
                            if not best_file or vf.get('width', 0) > best_file.get('width', 0):
                                if vf.get('width', 0) <= 1920:  # Don't go too high res
                                    best_file = vf
                    
                    if best_file:
                        return {
                            "url": best_file['link'],
                            "duration": video.get('duration', 10),
                            "width": best_file.get('width', 1080),
                            "height": best_file.get('height', 1920),
                            "source": "pexels"
                        }
                        
            elif response.status_code == 429:
                logger.warning("Pexels rate limit hit")
            else:
                logger.error(f"Pexels API error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error fetching from Pexels: {str(e)}")
        
        return None
    
    async def _fetch_from_pixabay(
        self, 
        query: str, 
        orientation: str,
        min_duration: int
    ) -> Optional[Dict]:
        """Fetch video from Pixabay API (fallback)"""
        if not PIXABAY_API_KEY:
            logger.warning("Pixabay API key not configured")
            return None
        
        try:
            params = {
                "key": PIXABAY_API_KEY,
                "q": query,
                "video_type": "film" if orientation == "landscape" else "all",
                "per_page": 5
            }
            
            response = await self.client.get(PIXABAY_API_URL, params=params)
            
            if response.status_code == 200:
                data = response.json()
                hits = data.get('hits', [])
                
                if hits:
                    video = hits[0]
                    
                    # Pixabay provides different sizes
                    videos = video.get('videos', {})
                    
                    # Prefer medium size for processing speed
                    size_key = 'medium'
                    if size_key not in videos:
                        size_key = 'small' if 'small' in videos else 'large'
                    
                    video_data = videos.get(size_key, {})
                    
                    if video_data:
                        return {
                            "url": video_data['url'],
                            "duration": video.get('duration', 10),
                            "width": video_data.get('width', 1080),
                            "height": video_data.get('height', 1920),
                            "source": "pixabay"
                        }
                        
            elif response.status_code == 429:
                logger.warning("Pixabay rate limit hit")
            else:
                logger.error(f"Pixabay API error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error fetching from Pixabay: {str(e)}")
        
        return None
    
    async def _download_video(self, url: str, filename: str) -> Optional[str]:
        """Download video from URL to local storage"""
        try:
            local_path = os.path.join(MEDIA_DIR, filename)
            
            # Download with streaming for large files
            async with self.client.stream("GET", url, timeout=60.0) as response:
                if response.status_code == 200:
                    with open(local_path, 'wb') as f:
                        async for chunk in response.aiter_bytes(chunk_size=8192):
                            f.write(chunk)
                    
                    # Verify file
                    if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
                        logger.info(f"Downloaded video: {local_path}")
                        return local_path
                    else:
                        logger.error("Downloaded file is too small or missing")
                        if os.path.exists(local_path):
                            os.remove(local_path)
                else:
                    logger.error(f"Download failed: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Error downloading video: {str(e)}")
        
        return None
    
    async def get_fallback_video(self, video_id: str) -> Optional[str]:
        """
        Get a fallback video (solid color or pattern) if stock fetch fails
        """
        try:
            # Create a simple colored video using FFmpeg
            output_path = os.path.join(MEDIA_DIR, f"{video_id}_fallback.mp4")
            
            import subprocess
            
            cmd = [
                'ffmpeg', '-y',
                '-f', 'lavfi',
                '-i', 'color=c=0x1a1a2e:s=1080x1920:d=10',
                '-f', 'lavfi',
                '-i', 'anoisesrc=a=0.1:c=pink',
                '-shortest',
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-crf', '28',
                '-c:a', 'aac',
                '-b:a', '128k',
                output_path
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0 and os.path.exists(output_path):
                return output_path
                
        except Exception as e:
            logger.error(f"Error creating fallback video: {str(e)}")
        
        return None


# Singleton instance
stock_service = StockService()
