"""
Text-to-Speech service using gTTS (Google Text-to-Speech) - FREE
"""
import os
from gtts import gTTS
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEDIA_DIR = "/app/media"


class TTSService:
    """Service for converting text to speech using free gTTS"""
    
    def __init__(self):
        os.makedirs(MEDIA_DIR, exist_ok=True)
    
    async def generate_audio(
        self, 
        text: str, 
        video_id: str,
        lang: str = 'en',
        slow: bool = False
    ) -> Optional[str]:
        """
        Generate audio from text using gTTS
        
        Args:
            text: Text to convert to speech
            video_id: Unique video ID for filename
            lang: Language code (default: 'en')
            slow: Speak slowly
            
        Returns:
            Path to generated audio file or None if failed
        """
        try:
            logger.info(f"Generating audio for video {video_id}")
            
            # Clean text for TTS
            clean_text = self._clean_text_for_tts(text)
            
            # Generate audio file path
            audio_path = os.path.join(MEDIA_DIR, f"{video_id}_audio.mp3")
            
            # Create gTTS object
            tts = gTTS(
                text=clean_text,
                lang=lang,
                slow=slow,
                lang_check=False  # Skip language check for speed
            )
            
            # Save audio file
            tts.save(audio_path)
            
            # Verify file was created
            if os.path.exists(audio_path) and os.path.getsize(audio_path) > 0:
                logger.info(f"Audio generated successfully: {audio_path}")
                return audio_path
            else:
                logger.error("Audio file not created or empty")
                return None
                
        except Exception as e:
            logger.error(f"Error generating audio: {str(e)}")
            return None
    
    def _clean_text_for_tts(self, text: str) -> str:
        """Clean text for better TTS output"""
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove special characters that might confuse TTS
        chars_to_remove = ['*', '#', '_', '~', '`', '|']
        for char in chars_to_remove:
            text = text.replace(char, '')
        
        # Limit length (gTTS has practical limits)
        max_chars = 5000
        if len(text) > max_chars:
            text = text[:max_chars]
            logger.warning(f"Text truncated to {max_chars} characters")
        
        return text.strip()
    
    async def generate_audio_for_scenes(
        self, 
        scenes: list, 
        video_id: str,
        lang: str = 'en'
    ) -> Optional[str]:
        """
        Generate audio for multiple scenes and combine them
        
        Args:
            scenes: List of scene dicts with 'text' key
            video_id: Unique video ID
            lang: Language code
            
        Returns:
            Path to combined audio file
        """
        try:
            # Combine all scene texts
            full_text = ' '.join([scene['text'] for scene in scenes])
            
            # Generate single audio file
            return await self.generate_audio(full_text, video_id, lang)
            
        except Exception as e:
            logger.error(f"Error generating scene audio: {str(e)}")
            return None


# Singleton instance
tts_service = TTSService()
