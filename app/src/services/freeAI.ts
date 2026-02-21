// Free AI Video Generation Service
// Uses only free-tier models and APIs

export interface VideoGenerationParams {
  title: string;
  script: string;
  background: string;
  font: string;
  voice?: string;
  duration?: number;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
}

// Free Text-to-Speech voices (using Web Speech API)
export const getFreeVoices = () => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices().filter(voice => 
      voice.lang.startsWith('en')
    );
  }
  return [];
};

// Free Image Generation using Pollinations AI (completely free)
export const generateFreeImage = async (prompt: string): Promise<string> => {
  // Pollinations AI - completely free, no API key needed
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true`;
};

// Free Text-to-Speech using Web Speech API
export const generateFreeVoiceover = (text: string, voiceName?: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    if (voiceName) {
      const selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;

    // For now, return a placeholder - in production you'd use a media recorder
    // This is a simplified version for the demo
    resolve(new Blob());
  });
};

// Video Generation using free resources
export const generateFreeVideo = async (
  params: VideoGenerationParams,
  onProgress?: (progress: number) => void
): Promise<GeneratedVideo> => {
  const videoId = `vid_${Date.now()}`;
  
  // Simulate generation progress
  const steps = [
    { progress: 10, message: 'Analyzing script...' },
    { progress: 25, message: 'Generating background visuals...' },
    { progress: 40, message: 'Creating voiceover...' },
    { progress: 60, message: 'Adding captions...' },
    { progress: 80, message: 'Applying effects...' },
    { progress: 100, message: 'Finalizing video...' },
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 800));
    onProgress?.(step.progress);
  }

  // Generate a thumbnail using free image service
  const thumbnailPrompt = `cinematic scene: ${params.title}, professional video thumbnail, dramatic lighting, high quality`;
  const thumbnail = await generateFreeImage(thumbnailPrompt);

  return {
    id: videoId,
    title: params.title,
    thumbnail,
    videoUrl: `data:video/mp4;base64,`, // Placeholder - would be actual video URL
    status: 'completed',
    progress: 100,
    createdAt: new Date(),
  };
};

// Free Music/Audio from free sources
export const getFreeBackgroundMusic = () => {
  return [
    { id: '1', name: 'Upbeat Electronic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', genre: 'Electronic' },
    { id: '2', name: 'Corporate Motivation', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', genre: 'Corporate' },
    { id: '3', name: 'Relaxing Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', genre: 'Ambient' },
    { id: '4', name: 'Epic Cinematic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', genre: 'Cinematic' },
    { id: '5', name: 'Lo-Fi Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', genre: 'Lo-Fi' },
  ];
};

// Free Stock Video Sources
export const getFreeStockVideos = () => {
  return [
    { id: '1', name: 'Nature', url: 'https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=139&oauth2_token_id=57447761', category: 'Nature' },
    { id: '2', name: 'City', url: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=139&oauth2_token_id=57447761', category: 'Urban' },
    { id: '3', name: 'Abstract', url: 'https://player.vimeo.com/external/477781392.sd.mp4?s=06ad2731dbf4baf67c80c5a001ec54018d3f3054&profile_id=139&oauth2_token_id=57447761', category: 'Abstract' },
    { id: '4', name: 'Technology', url: 'https://player.vimeo.com/external/451837698.sd.mp4?s=8d74f8c971535fd2f0f3a3cf6287508c87754a04&profile_id=139&oauth2_token_id=57447761', category: 'Tech' },
  ];
};

// Caption Generation (free, client-side)
export const generateCaptions = (script: string): string[] => {
  // Simple sentence splitting for captions
  return script
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.substring(0, 100)); // Limit caption length
};

// Save video to local storage (free storage)
export const saveVideoToLibrary = (video: GeneratedVideo) => {
  const existing = JSON.parse(localStorage.getItem('faceless_videos') || '[]');
  existing.push(video);
  localStorage.setItem('faceless_videos', JSON.stringify(existing));
};

export const getVideoLibrary = (): GeneratedVideo[] => {
  return JSON.parse(localStorage.getItem('faceless_videos') || '[]');
};

export const deleteVideo = (videoId: string) => {
  const existing = JSON.parse(localStorage.getItem('faceless_videos') || '[]');
  const filtered = existing.filter((v: GeneratedVideo) => v.id !== videoId);
  localStorage.setItem('faceless_videos', JSON.stringify(filtered));
};
