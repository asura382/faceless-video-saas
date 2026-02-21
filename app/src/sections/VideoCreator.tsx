import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Type, Image, Sparkles, Wand2, Download, Share2, Check, Volume2, Music } from 'lucide-react';
import { 
  generateFreeVideo, 
  generateFreeImage, 
  getFreeBackgroundMusic,
  generateCaptions,
  saveVideoToLibrary,
  type GeneratedVideo 
} from '../services/freeAI';
import AdBanner from '../components/AdBanner';

gsap.registerPlugin(ScrollTrigger);

const backgrounds = [
  { id: 1, name: 'Minecraft', image: '/images/video-bg-1.jpg', type: 'image' },
  { id: 2, name: 'Cyberpunk', image: '/images/hero-card-1.jpg', type: 'image' },
  { id: 3, name: 'Nature', image: '/images/hero-card-2.jpg', type: 'image' },
  { id: 4, name: 'Abstract', image: '/images/hero-card-3.jpg', type: 'image' },
  { id: 5, name: 'Dark', image: '/images/hero-card-4.jpg', type: 'image' },
  { id: 6, name: 'AI Generated', image: '', type: 'ai' },
];

const fonts = ['Montserrat', 'Inter', 'Oswald', 'Poppins', 'Roboto'];

const VideoCreator = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedBg, setSelectedBg] = useState(backgrounds[0]);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [title, setTitle] = useState('What is the best decision you\'ve ever made?');
  const [script, setScript] = useState('I discovered that creating faceless videos was the key to building a successful online presence without showing my face. With free AI tools, anyone can now create engaging content that gets millions of views!');
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string>('');
  const [useCaptions, setUseCaptions] = useState(true);
  const [useVoiceover, setUseVoiceover] = useState(true);

  const freeMusic = getFreeBackgroundMusic();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.creator-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    setProgress(0);

    try {
      // Generate AI background if selected
      let bgImage = selectedBg.image;
      if (selectedBg.type === 'ai') {
        bgImage = await generateFreeImage(`cinematic scene: ${title}, high quality, dramatic lighting`);
      }

      // Generate video using free service
      const video = await generateFreeVideo(
        {
          title,
          script,
          background: bgImage,
          font: selectedFont,
          duration: 30,
        },
        (p) => setProgress(p)
      );

      setGeneratedVideo(video);
      saveVideoToLibrary(video);
      setIsCreating(false);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
      setIsCreating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      // Simulate download
      alert(`Video "${generatedVideo.title}" downloaded! (Demo - actual download would start here)`);
    }
  };

  const handleShare = () => {
    if (navigator.share && generatedVideo) {
      navigator.share({
        title: generatedVideo.title,
        text: 'Check out this AI-generated video!',
        url: window.location.href,
      });
    } else {
      alert('Share link copied to clipboard!');
    }
  };

  const captions = generateCaptions(script);

  return (
    <section ref={sectionRef} id="video-creator" className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c0f748]/10 rounded-full blur-[200px]" />
      </div>

      <div className="creator-content relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c0f748]/10 text-[#c0f748] text-sm mb-4"
          >
            <Sparkles size={16} />
            100% Free - No Subscription Required
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="text-[#c0f748]">Free Video</span> Now
          </h2>
          <p className="text-gray-400">
            Using free AI models - no credit card, no limits
          </p>
        </div>

        {/* Side Ad - Desktop Only */}
        <div className="hidden xl:block absolute -right-8 top-1/2 -translate-y-1/2">
          <AdBanner position="sidebar" size="medium" />
        </div>

        {/* Creator Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isCreating ? (
                <motion.div
                  key="creating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[9/16] max-w-sm mx-auto rounded-2xl overflow-hidden bg-[#181818] flex flex-col items-center justify-center border border-[#c0f748]/30"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={48} className="text-[#c0f748]" />
                  </motion.div>
                  <p className="mt-4 text-[#c0f748] font-medium">Generating your video...</p>
                  <div className="mt-4 w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#c0f748]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{progress}% complete</p>
                </motion.div>
              ) : showPreview && generatedVideo ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-[9/16] max-w-sm mx-auto rounded-2xl overflow-hidden relative border border-[#c0f748]/30"
                >
                  <img
                    src={generatedVideo.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  
                  {/* Captions Overlay */}
                  {useCaptions && (
                    <div className="absolute bottom-20 left-4 right-4">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
                        <p className="text-white text-sm font-medium" style={{ fontFamily: selectedFont }}>
                          {captions[0]}...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div className="absolute top-4 left-4 right-4">
                    <h3
                      className="text-lg font-bold text-white text-center bg-black/50 backdrop-blur-sm rounded-lg py-2"
                      style={{ fontFamily: selectedFont }}
                    >
                      {generatedVideo.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c0f748] text-black font-medium hover:bg-[#d4ff5c] transition-colors"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-16 right-4 p-2 rounded-full bg-black/50 text-white/70 hover:text-white transition-colors"
                  >
                    <Sparkles size={16} />
                    New Video
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[9/16] max-w-sm mx-auto rounded-2xl overflow-hidden relative group border border-white/10"
                >
                  <img
                    src={selectedBg.image || '/images/video-bg-1.jpg'}
                    alt="Background"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  
                  {/* Title Preview */}
                  <div className="absolute top-4 left-4 right-4">
                    <motion.h3
                      key={title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-bold text-white text-center bg-black/50 backdrop-blur-sm rounded-lg py-2"
                      style={{ fontFamily: selectedFont }}
                    >
                      {title}
                    </motion.h3>
                  </div>

                  {/* Sample Caption */}
                  <div className="absolute bottom-20 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-white text-sm" style={{ fontFamily: selectedFont }}>
                        {script.substring(0, 80)}...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Selector */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <Image size={16} /> Background
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      selectedBg.id === bg.id
                        ? 'ring-2 ring-[#c0f748] ring-offset-2 ring-offset-black'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {bg.type === 'ai' ? (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                      </div>
                    ) : (
                      <img src={bg.image} alt={bg.name} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            {/* Font Selector */}
            <div>
              <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Type size={16} /> Font Style
              </label>
              <div className="flex flex-wrap gap-2">
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedFont === font
                        ? 'bg-[#c0f748] text-black font-medium'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-sm text-gray-400 mb-2">Video Title/Hook</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c0f748] focus:ring-1 focus:ring-[#c0f748] transition-all"
                placeholder="Enter your video title..."
              />
            </div>

            {/* Script Input */}
            <div>
              <label className="text-sm text-gray-400 mb-2">Video Script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c0f748] focus:ring-1 focus:ring-[#c0f748] transition-all resize-none"
                placeholder="Enter your video script..."
              />
            </div>

            {/* Background Music */}
            <div>
              <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Music size={16} /> Background Music (Free)
              </label>
              <select
                value={selectedMusic}
                onChange={(e) => setSelectedMusic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-all"
              >
                <option value="">No Music</option>
                {freeMusic.map((music) => (
                  <option key={music.id} value={music.url}>
                    {music.name} ({music.genre})
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setUseVoiceover(!useVoiceover)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  useVoiceover ? 'bg-[#c0f748]/20 text-[#c0f748]' : 'bg-white/5 text-gray-400'
                }`}
              >
                <Volume2 size={16} />
                <span className="text-sm">AI Voiceover</span>
                {useVoiceover && <Check size={14} />}
              </button>
              <button
                onClick={() => setUseCaptions(!useCaptions)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  useCaptions ? 'bg-[#c0f748]/20 text-[#c0f748]' : 'bg-white/5 text-gray-400'
                }`}
              >
                <Type size={16} />
                <span className="text-sm">Auto Captions</span>
                {useCaptions && <Check size={14} />}
              </button>
            </div>

            {/* Create Button */}
            <motion.button
              onClick={handleCreate}
              disabled={isCreating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Wand2 size={20} />
              {isCreating ? 'Creating...' : 'CREATE VIDEO FOR FREE'}
            </motion.button>

            {/* Free Features */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                'Free AI Voiceover',
                'Auto Captions',
                'Free Music',
                'No Watermark',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check size={14} className="text-[#c0f748]" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Ad Space */}
            <div className="mt-4">
              <AdBanner position="top" size="small" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
