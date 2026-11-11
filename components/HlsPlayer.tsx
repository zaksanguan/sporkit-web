'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

// Plays a Bunny HLS (.m3u8) video. Safari / iOS play HLS natively; other browsers
// (Android in-app browsers such as LINE) use hls.js. Tap to play, no autoplay.
export default function HlsPlayer({ src, poster, autoPlay = false }: { src: string; poster?: string; autoPlay?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      if (autoPlay) video.play().catch(() => {})
      return
    }
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      if (autoPlay) hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
      return () => hls.destroy()
    }
  }, [src, autoPlay])

  return (
    <video
      ref={ref}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
    />
  )
}
