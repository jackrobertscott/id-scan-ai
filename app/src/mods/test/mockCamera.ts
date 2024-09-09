import assetUrl from "./path/to/your/asset.webm"

export function mockCamera() {
  if (!navigator.mediaDevices.getUserMedia) {
    console.warn("getUserMedia is not supported in this browser")
    return
  }

  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  )

  navigator.mediaDevices.getUserMedia = async (
    constraints: MediaStreamConstraints
  ) => {
    if (constraints.video) {
      const video = document.createElement("video")
      video.src = assetUrl
      video.muted = true
      video.loop = true

      // Wait for the video to load metadata
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve()
      })

      await video.play()

      // Fallback to canvas if captureStream is not available
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")

      let stream: MediaStream = canvas.captureStream(30) // 30 FPS

      const drawVideo = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        }
        requestAnimationFrame(drawVideo)
      }

      drawVideo()

      return stream
    }

    // If not requesting video, use the original getUserMedia
    return originalGetUserMedia(constraints)
  }
}
