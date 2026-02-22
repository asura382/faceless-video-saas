export interface Video {
  id: string
  topic: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  video_url?: string
  thumbnail_url?: string
  script?: string
  created_at: string
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// Create new video
export async function createVideo(data: { topic: string; duration: number }) {
  const res = await fetch(`${API_BASE}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create video")
  }

  return res.json()
}

// Get single video
export async function getVideo(id: string) {
  const res = await fetch(`${API_BASE}/videos/${id}`)

  if (!res.ok) {
    throw new Error("Failed to fetch video")
  }

  return res.json()
}

// List all videos
export async function listVideos() {
  const res = await fetch(`${API_BASE}/videos`)

  if (!res.ok) {
    throw new Error("Failed to list videos")
  }

  return res.json()
}

// Delete video
export async function deleteVideo(id: string) {
  const res = await fetch(`${API_BASE}/videos/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete video")
  }
}

// Download URL
export function downloadVideo(id: string) {
  return `${API_BASE}/videos/${id}/download`
}

// Convert media path to full URL
export function getMediaUrl(path: string) {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return `${API_BASE}/${path}`
}