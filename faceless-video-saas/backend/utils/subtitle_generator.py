"""
Subtitle/SRT generator for videos
"""
import os
import re
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MEDIA_DIR = "/app/media"


class SubtitleGenerator:
    """Generate SRT subtitle files from script"""
    
    def __init__(self):
        os.makedirs(MEDIA_DIR, exist_ok=True)
    
    def generate_srt(
        self, 
        script: str, 
        video_id: str,
        words_per_second: float = 2.3
    ) -> str:
        """
        Generate SRT subtitle file from script
        
        Args:
            script: Full video script
            video_id: Unique video ID
            words_per_second: Speaking rate
            
        Returns:
            Path to generated SRT file
        """
        try:
            # Split script into subtitle chunks (2-4 words each)
            chunks = self._split_into_chunks(script)
            
            # Generate SRT content
            srt_content = self._create_srt_content(chunks, words_per_second)
            
            # Save SRT file
            srt_path = os.path.join(MEDIA_DIR, f"{video_id}.srt")
            with open(srt_path, 'w', encoding='utf-8') as f:
                f.write(srt_content)
            
            logger.info(f"Generated SRT file: {srt_path}")
            return srt_path
            
        except Exception as e:
            logger.error(f"Error generating subtitles: {str(e)}")
            raise
    
    def _split_into_chunks(self, script: str, max_chars: int = 40) -> List[str]:
        """Split script into subtitle chunks"""
        # Clean script
        script = re.sub(r'\s+', ' ', script).strip()
        
        # Split into sentences first
        sentences = re.split(r'(?<=[.!?])\s+', script)
        
        chunks = []
        for sentence in sentences:
            words = sentence.split()
            current_chunk = []
            current_length = 0
            
            for word in words:
                word_length = len(word)
                
                if current_length + word_length + 1 <= max_chars:
                    current_chunk.append(word)
                    current_length += word_length + 1
                else:
                    if current_chunk:
                        chunks.append(' '.join(current_chunk))
                    current_chunk = [word]
                    current_length = word_length
            
            if current_chunk:
                chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def _create_srt_content(
        self, 
        chunks: List[str], 
        words_per_second: float
    ) -> str:
        """Create SRT format content"""
        srt_lines = []
        current_time = 0.0
        
        for i, chunk in enumerate(chunks, 1):
            # Calculate duration based on word count
            word_count = len(chunk.split())
            duration = max(1.5, word_count / words_per_second)  # Minimum 1.5 seconds
            
            # Format timestamps
            start_time = self._format_timestamp(current_time)
            end_time = self._format_timestamp(current_time + duration)
            
            # Add subtitle entry
            srt_lines.append(f"{i}")
            srt_lines.append(f"{start_time} --> {end_time}")
            srt_lines.append(chunk)
            srt_lines.append("")  # Empty line between entries
            
            current_time += duration
        
        return '\n'.join(srt_lines)
    
    def _format_timestamp(self, seconds: float) -> str:
        """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
    
    def generate_ass(
        self, 
        script: str, 
        video_id: str,
        style: Dict = None
    ) -> str:
        """
        Generate ASS (Advanced SubStation Alpha) subtitle file
        Better styling options than SRT
        """
        try:
            default_style = {
                'fontname': 'Arial',
                'fontsize': '48',
                'primary_colour': '&H00FFFFFF',  # White
                'secondary_colour': '&H000000FF',
                'outline_colour': '&H00000000',  # Black outline
                'back_colour': '&H00000000',
                'bold': '1',
                'italic': '0',
                'border_style': '1',
                'outline': '3',
                'shadow': '0',
                'alignment': '2',  # Center bottom
                'margin_v': '50'
            }
            
            style = style or default_style
            
            chunks = self._split_into_chunks(script)
            
            # ASS header
            ass_header = f"""[Script Info]
Title: {video_id}
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{style['fontname']},{style['fontsize']},{style['primary_colour']},{style['secondary_colour']},{style['outline_colour']},{style['back_colour']},{style['bold']},{style['italic']},0,0,100,100,0,0,{style['border_style']},{style['outline']},{style['shadow']},{style['alignment']},10,10,{style['margin_v']},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
            
            # Generate dialogue lines
            dialogue_lines = []
            current_time = 0.0
            words_per_second = 2.3
            
            for chunk in chunks:
                word_count = len(chunk.split())
                duration = max(1.5, word_count / words_per_second)
                
                start = self._format_ass_time(current_time)
                end = self._format_ass_time(current_time + duration)
                
                dialogue_lines.append(
                    f"Dialogue: 0,{start},{end},Default,,0,0,0,,{chunk}"
                )
                
                current_time += duration
            
            # Save ASS file
            ass_content = ass_header + '\n'.join(dialogue_lines)
            ass_path = os.path.join(MEDIA_DIR, f"{video_id}.ass")
            
            with open(ass_path, 'w', encoding='utf-8') as f:
                f.write(ass_content)
            
            logger.info(f"Generated ASS file: {ass_path}")
            return ass_path
            
        except Exception as e:
            logger.error(f"Error generating ASS subtitles: {str(e)}")
            raise
    
    def _format_ass_time(self, seconds: float) -> str:
        """Convert seconds to ASS time format (H:MM:SS.cc)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        centis = int((seconds % 1) * 100)
        
        return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"


# Singleton instance
subtitle_generator = SubtitleGenerator()
