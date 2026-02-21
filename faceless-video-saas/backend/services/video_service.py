"""
Video processing service using FFmpeg
"""
import os
import subprocess
import logging
from typing import List, Optional, Dict
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEDIA_DIR = "/app/media"


class VideoService:
    """Service for video processing and generation using FFmpeg"""
    
    def __init__(self):
        os.makedirs(MEDIA_DIR, exist_ok=True)
        self._verify_ffmpeg()
    
    def _verify_ffmpeg(self):
        """Verify FFmpeg is installed"""
        try:
            result = subprocess.run(
                ['ffmpeg', '-version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                version = result.stdout.split('\n')[0]
                logger.info(f"FFmpeg verified: {version}")
            else:
                logger.error("FFmpeg not found or not working")
        except Exception as e:
            logger.error(f"FFmpeg verification failed: {str(e)}")
    
    async def create_final_video(
        self,
        video_id: str,
        video_clips: List[Dict],
        audio_path: str,
        subtitle_path: str,
        target_duration: int = 60
    ) -> Optional[str]:
        """
        Create final video by combining clips, audio, and subtitles
        
        Args:
            video_id: Unique video ID
            video_clips: List of video clip paths
            audio_path: Path to audio file
            subtitle_path: Path to subtitle file
            target_duration: Target video duration
            
        Returns:
            Path to final video file
        """
        try:
            logger.info(f"Creating final video: {video_id}")
            
            # Step 1: Concatenate video clips
            concat_video = await self._concatenate_clips(video_clips, video_id)
            if not concat_video:
                logger.error("Failed to concatenate clips")
                return None
            
            # Step 2: Add audio
            video_with_audio = await self._add_audio(concat_video, audio_path, video_id)
            if not video_with_audio:
                logger.error("Failed to add audio")
                return None
            
            # Step 3: Add subtitles
            final_video = await self._burn_subtitles(
                video_with_audio, 
                subtitle_path, 
                video_id
            )
            if not final_video:
                logger.error("Failed to add subtitles")
                # Return video without subtitles as fallback
                final_video = video_with_audio
            
            # Step 4: Convert to 9:16 format and optimize
            optimized_video = await self._optimize_video(final_video, video_id)
            if optimized_video:
                final_video = optimized_video
            
            logger.info(f"Final video created: {final_video}")
            return final_video
            
        except Exception as e:
            logger.error(f"Error creating final video: {str(e)}")
            return None
    
    async def _concatenate_clips(
        self, 
        clips: List[Dict], 
        video_id: str
    ) -> Optional[str]:
        """Concatenate multiple video clips"""
        try:
            if not clips:
                logger.error("No clips to concatenate")
                return None
            
            if len(clips) == 1:
                return clips[0]['local_path']
            
            # Create concat list file
            list_path = os.path.join(MEDIA_DIR, f"{video_id}_concat_list.txt")
            concat_path = os.path.join(MEDIA_DIR, f"{video_id}_concat.mp4")
            
            with open(list_path, 'w') as f:
                for clip in clips:
                    f.write(f"file '{clip['local_path']}'\n")
            
            # Run FFmpeg concat
            cmd = [
                'ffmpeg', '-y',
                '-f', 'concat',
                '-safe', '0',
                '-i', list_path,
                '-c', 'copy',
                '-movflags', '+faststart',
                concat_path
            ]
            
            result = await self._run_ffmpeg(cmd)
            
            # Cleanup list file
            if os.path.exists(list_path):
                os.remove(list_path)
            
            if result and os.path.exists(concat_path):
                return concat_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error concatenating clips: {str(e)}")
            return None
    
    async def _add_audio(
        self, 
        video_path: str, 
        audio_path: str,
        video_id: str
    ) -> Optional[str]:
        """Add audio to video"""
        try:
            output_path = os.path.join(MEDIA_DIR, f"{video_id}_with_audio.mp4")
            
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-i', audio_path,
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-shortest',  # Match shortest input
                '-movflags', '+faststart',
                output_path
            ]
            
            result = await self._run_ffmpeg(cmd)
            
            if result and os.path.exists(output_path):
                return output_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error adding audio: {str(e)}")
            return None
    
    async def _burn_subtitles(
        self, 
        video_path: str, 
        subtitle_path: str,
        video_id: str
    ) -> Optional[str]:
        """Burn subtitles into video"""
        try:
            output_path = os.path.join(MEDIA_DIR, f"{video_id}_final.mp4")
            
            # Use ASS format for better styling if available
            ass_path = subtitle_path.replace('.srt', '.ass')
            
            if os.path.exists(ass_path):
                subtitle_file = ass_path
                subtitle_format = "ass"
            else:
                subtitle_file = subtitle_path
                subtitle_format = "srt"
            
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-vf', f"subtitles={subtitle_file}:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'",
                '-c:a', 'copy',
                '-movflags', '+faststart',
                output_path
            ]
            
            result = await self._run_ffmpeg(cmd)
            
            if result and os.path.exists(output_path):
                return output_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error burning subtitles: {str(e)}")
            return None
    
    async def _optimize_video(
        self, 
        video_path: str, 
        video_id: str
    ) -> Optional[str]:
        """Optimize video for web and mobile"""
        try:
            output_path = os.path.join(MEDIA_DIR, f"{video_id}.mp4")
            
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-movflags', '+faststart',
                '-pix_fmt', 'yuv420p',
                output_path
            ]
            
            result = await self._run_ffmpeg(cmd)
            
            if result and os.path.exists(output_path):
                return output_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error optimizing video: {str(e)}")
            return None
    
    async def _run_ffmpeg(self, cmd: List[str]) -> bool:
        """Run FFmpeg command asynchronously"""
        try:
            logger.info(f"Running FFmpeg: {' '.join(cmd[:10])}...")
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=300  # 5 minute timeout
            )
            
            if process.returncode == 0:
                logger.info("FFmpeg completed successfully")
                return True
            else:
                logger.error(f"FFmpeg failed: {stderr.decode()[:500]}")
                return False
                
        except asyncio.TimeoutError:
            logger.error("FFmpeg timeout")
            return False
        except Exception as e:
            logger.error(f"FFmpeg error: {str(e)}")
            return False
    
    async def generate_thumbnail(
        self, 
        video_path: str, 
        video_id: str,
        time_offset: str = "00:00:03"
    ) -> Optional[str]:
        """Generate thumbnail from video"""
        try:
            thumbnail_path = os.path.join(MEDIA_DIR, f"{video_id}_thumb.jpg")
            
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-ss', time_offset,
                '-vframes', '1',
                '-q:v', '2',
                thumbnail_path
            ]
            
            result = await self._run_ffmpeg(cmd)
            
            if result and os.path.exists(thumbnail_path):
                return thumbnail_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating thumbnail: {str(e)}")
            return None
    
    async def cleanup_temp_files(self, video_id: str):
        """Clean up temporary files after processing"""
        try:
            temp_patterns = [
                f"{video_id}_concat",
                f"{video_id}_with_audio",
                f"{video_id}_scene_",
                f"{video_id}_concat_list"
            ]
            
            for filename in os.listdir(MEDIA_DIR):
                for pattern in temp_patterns:
                    if pattern in filename:
                        filepath = os.path.join(MEDIA_DIR, filename)
                        try:
                            os.remove(filepath)
                            logger.info(f"Cleaned up: {filepath}")
                        except Exception as e:
                            logger.warning(f"Failed to cleanup {filepath}: {e}")
                            
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")


# Singleton instance
video_service = VideoService()
