"""
Script generation service using HuggingFace Inference API (Free Tier)
"""
import os
import httpx
import asyncio
from typing import Optional, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# HuggingFace Inference API (Free tier - rate limited)
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "")

# Fallback to a smaller model if rate limited
FALLBACK_MODEL = "https://api-inference.huggingface.co/models/google/flan-t5-large"


class ScriptService:
    """Service for generating video scripts using free AI models"""
    
    def __init__(self):
        self.headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
        self.client = httpx.AsyncClient(timeout=60.0)
    
    async def generate_script(
        self, 
        topic: str, 
        duration: int = 60,
        max_retries: int = 3
    ) -> dict:
        """
        Generate an engaging script for a short-form video
        
        Args:
            topic: Video topic
            duration: Target duration in seconds
            max_retries: Number of retry attempts
            
        Returns:
            dict with full_script and scenes
        """
        # Calculate word count (approx 130-150 words per minute for narration)
        target_words = int((duration / 60) * 140)
        
        prompt = f"""<s>[INST] Write an engaging, viral short-form video script about "{topic}".

Requirements:
- Target length: {target_words} words (about {duration} seconds when spoken)
- Style: Attention-grabbing, conversational, perfect for TikTok/YouTube Shorts
- Structure: Hook in first 3 seconds, 3-5 key points, strong call-to-action at end
- Format: Return ONLY the script text, no stage directions or formatting

Make it exciting and shareable! [/INST]</s>"""
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Generating script for topic: {topic} (attempt {attempt + 1})")
                
                response = await self.client.post(
                    HF_API_URL,
                    headers=self.headers,
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "max_new_tokens": 500,
                            "temperature": 0.8,
                            "top_p": 0.95,
                            "return_full_text": False
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Extract generated text
                    if isinstance(result, list) and len(result) > 0:
                        generated_text = result[0].get("generated_text", "")
                    elif isinstance(result, dict):
                        generated_text = result.get("generated_text", "")
                    else:
                        generated_text = str(result)
                    
                    # Clean up the script
                    script = self._clean_script(generated_text)
                    
                    # Split into scenes
                    scenes = self._split_into_scenes(script)
                    
                    logger.info(f"Successfully generated script with {len(scenes)} scenes")
                    
                    return {
                        "full_script": script,
                        "scenes": scenes,
                        "word_count": len(script.split()),
                        "estimated_duration": len(script.split()) / 2.3  # ~2.3 words/sec
                    }
                    
                elif response.status_code == 503:
                    # Model loading, wait and retry
                    logger.warning("Model loading, waiting...")
                    await asyncio.sleep(10)
                    continue
                    
                elif response.status_code == 429:
                    # Rate limited
                    logger.warning("Rate limited, waiting...")
                    await asyncio.sleep(5 * (attempt + 1))
                    continue
                    
                else:
                    logger.error(f"API error: {response.status_code} - {response.text}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(2 ** attempt)
                        continue
                        
            except httpx.TimeoutException:
                logger.warning(f"Timeout on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                    
            except Exception as e:
                logger.error(f"Error generating script: {str(e)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
        
        # If all retries failed, use fallback template
        logger.warning("Using fallback script template")
        return self._fallback_script(topic, duration)
    
    def _clean_script(self, text: str) -> str:
        """Clean up generated script"""
        # Remove instruction tokens
        text = text.replace("[INST]", "").replace("[/INST]", "")
        text = text.replace("<s>", "").replace("</s>", "")
        
        # Remove common prefixes
        prefixes = [
            "Here is", "Here's", "Script:", "Video Script:", 
            "Here is the script:", "Here is an engaging script:"
        ]
        for prefix in prefixes:
            if text.strip().startswith(prefix):
                text = text[len(prefix):].strip()
        
        # Clean up whitespace
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        text = ' '.join(lines)
        
        # Remove extra spaces
        text = ' '.join(text.split())
        
        return text.strip()
    
    def _split_into_scenes(self, script: str, sentences_per_scene: int = 2) -> List[dict]:
        """Split script into scenes for video generation"""
        import re
        
        # Split into sentences
        sentences = re.split(r'(?<=[.!?])\s+', script)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        scenes = []
        for i in range(0, len(sentences), sentences_per_scene):
            scene_sentences = sentences[i:i + sentences_per_scene]
            scene_text = ' '.join(scene_sentences)
            
            # Extract keywords for stock video search
            keywords = self._extract_keywords(scene_text)
            
            scenes.append({
                "scene_number": len(scenes) + 1,
                "text": scene_text,
                "keywords": keywords,
                "duration": len(scene_text.split()) / 2.3  # estimated seconds
            })
        
        return scenes
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords for stock video search"""
        # Remove common words
        common_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
            'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
            'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her',
            'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why',
            'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
            'too', 'very', 'can', 'just', 'should', 'now', 'get', 'like', 'one',
            'also', 'know', 'think', 'see', 'want', 'come', 'look', 'use', 'find',
            'give', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call'
        }
        
        words = text.lower().split()
        keywords = [w.strip('.,!?;:"()[]') for w in words if len(w) > 3]
        keywords = [k for k in keywords if k not in common_words]
        
        # Return top 3 unique keywords
        seen = set()
        unique_keywords = []
        for k in keywords:
            if k not in seen and len(unique_keywords) < 3:
                seen.add(k)
                unique_keywords.append(k)
        
        return unique_keywords if unique_keywords else ["video", "content"]
    
    def _fallback_script(self, topic: str, duration: int) -> dict:
        """Generate a fallback script if AI fails"""
        hooks = [
            f"You won't believe these facts about {topic}!",
            f"Stop everything and listen to this about {topic}!",
            f"This changed everything I knew about {topic}!",
            f"Mind = blown! Here's the truth about {topic}!",
        ]
        
        import random
        hook = random.choice(hooks)
        
        script = f"""{hook}

Did you know that {topic} has some incredible secrets that most people never discover? Today, I'm going to share the most fascinating facts that will change your perspective forever.

First, let's talk about why {topic} matters more than you think. The impact it has on our daily lives is absolutely mind-blowing when you really understand it.

Here's what nobody tells you: the real story behind {topic} is even more interesting than what you've heard. There are hidden connections and surprising details that most experts don't even mention.

If you found this interesting, make sure to follow for more amazing content like this. Drop a comment with your thoughts on {topic}!"""
        
        scenes = self._split_into_scenes(script)
        
        return {
            "full_script": script,
            "scenes": scenes,
            "word_count": len(script.split()),
            "estimated_duration": len(script.split()) / 2.3,
            "fallback": True
        }


# Singleton instance
script_service = ScriptService()
