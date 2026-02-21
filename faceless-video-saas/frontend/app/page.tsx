'use client'

import { useState, useEffect, useCallback } from 'react'
import { Video, History, Sparkles, Download, Trash2, RefreshCw, Play, CheckCircle, AlertCircle } from 'lucide-react'
import { createVideo, getVideo, listVideos, deleteVideo, downloadVideo, getMediaUrl, Video as VideoType } from '@/services/api'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import VideoPlayer from '@/components/VideoPlayer'
import ProgressBar from '@/components/ProgressBar'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(60)
  const [isCreating, setIsCreating] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null)
  const [videos, setVideos] = useState<VideoType[]>([])
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')
  const [error, setError] = useState<string | null>(null)

  // Poll for video updates
  const pollVideoStatus = useCallback(async (videoId: string) => {
    try {
      const video = await getVideo(videoId)
      setCurrentVideo(video)
      
      if (video.status === 'completed' || video.status === 'failed') {
        setIsCreating(false)
        if (video.status === 'completed') {
          refreshVideos()
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Error polling video:', err)
      return false
    }
  }, [])

  // Start polling when video is being created
  useEffect(() => {
    if (!currentVideo || !isCreating) return
    
    if (currentVideo.status === 'completed' || currentVideo.status === 'failed') {
      return
    }

    const interval = setInterval(async () => {
      const done = await pollVideoStatus(currentVideo.id)
      if (done) {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentVideo, isCreating, pollVideoStatus])

  // Load videos on mount
  useEffect(() => {
    refreshVideos()
  }, [])

  const refreshVideos = async () => {
    try {
      const response = await listVideos()
      setVideos(response.videos)
    } catch (err) {
      console.error('Error loading videos:', err)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsCreating(true)
    setError(null)
    setCurrentVideo(null)

    try {
      const video = await createVideo({ topic, duration })
      setCurrentVideo(video)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create video')
      setIsCreating(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    
    try {
      await deleteVideo(videoId)
      refreshVideos()
      if (currentVideo?.id === videoId) {
        setCurrentVideo(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-dark-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Faceless Video</h1>
              <p className="text-xs text-gray-400">AI-Powered Video Generation</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              History
              {videos.length > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                  {videos.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'create' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Form */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-2">Create New Video</h2>
                <p className="text-gray-400 mb-6">
                  Enter a topic and let AI generate a viral faceless video for you.
                </p>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., 10 Amazing Facts About Space"
                      className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration: {duration} seconds
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="180"
                      step="10"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      disabled={isCreating}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30s</span>
                      <span>180s</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreating || !topic.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow"
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Creating Video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Video
                      </>
                    )}
                  </button>
                </form>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">What&apos;s included:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'AI Script Generation',
                      'Text-to-Speech',
                      'Stock Footage',
                      'Auto Subtitles',
                      '9:16 Format',
                      'Free Forever',
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-primary-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress */}
              {isCreating && currentVideo && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Creating Your Video</h3>
                  <ProgressBar 
                    progress={currentVideo.progress} 
                    status={currentVideo.status}
                  />
                  <div className="mt-4 text-sm text-gray-400">
                    {currentVideo.script && (
                      <div className="mt-4 p-4 bg-dark-700 rounded-xl max-h-48 overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-2">Generated Script:</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {currentVideo.script}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              {currentVideo?.status === 'completed' && currentVideo.video_url ? (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Your Video is Ready!</h3>
                  <VideoPlayer 
                    src={getMediaUrl(currentVideo.video_url)} 
                    poster={currentVideo.thumbnail_url ? getMediaUrl(currentVideo.thumbnail_url) : undefined}
                  />
                  <div className="mt-4 flex gap-3">
                    <a
                      href={downloadVideo(currentVideo.id)}
                      download
                      className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download MP4
                    </a>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
                    <Video className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No Video Yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Create your first video by entering a topic above. It only takes a few minutes!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Videos</h2>
              <button
                onClick={refreshVideos}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  No Videos Yet
                </h3>
                <p className="text-gray-500">
                  Create your first video to see it here.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="glass rounded-2xl overflow-hidden group">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-dark-700 relative">
                      {video.thumbnail_url ? (
                        <img
                          src={getMediaUrl(video.thumbnail_url)}
                          alt={video.topic}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium bg-dark-900/80 ${getStatusColor(video.status)}`}>
                        {getStatusLabel(video.status)}
                      </div>

                      {/* Play Button (if completed) */}
                      {video.status === 'completed' && video.video_url && (
                        <a
                          href={getMediaUrl(video.video_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-white truncate mb-1">
                        {video.topic}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDate(video.created_at)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {video.status === 'completed' && (
                          <a
                            href={downloadVideo(video.id)}
                            download
                            className="flex-1 py-2 rounded-lg bg-primary-500/20 text-primary-400 text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary-500/30 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Faceless Video. Free AI Video Generation.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span>Powered by HuggingFace</span>
              <span>•</span>
              <span>Pexels</span>
              <span>•</span>
              <span>FFmpeg</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
