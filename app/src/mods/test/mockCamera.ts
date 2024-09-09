import assetUrl from "../../assets/faces/IMG_2925.jpg"

export function mockCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn("getUserMedia is not supported in this browser")
    return
  }

  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  )

  navigator.mediaDevices.getUserMedia = async (
    constraints: MediaStreamConstraints
  ): Promise<MediaStream> => {
    if (constraints.video) {
      const img = new Image()
      img.src = assetUrl

      await new Promise<void>((resolve) => {
        img.onload = () => resolve()
      })

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Failed to get 2D context from canvas")
      }

      ctx.drawImage(img, 0, 0)

      let stream: MediaStream
      if (canvas.captureStream) {
        stream = canvas.captureStream()
      } else {
        // Fallback for browsers that don't support captureStream
        stream = new MediaStream()
        const track = (canvas as any).captureStream().getVideoTracks()[0]
        stream.addTrack(track)
      }

      return stream
    }

    // If not requesting video, use the original getUserMedia
    return originalGetUserMedia(constraints)
  }
}
