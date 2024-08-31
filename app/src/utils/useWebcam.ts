import {useEffect, useRef, useState} from "react"

export const useWebcam = ({
  disabled,
  maxWidth = 1280,
}: {
  disabled?: boolean
  maxWidth?: number
} = {}) => {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const captureRef = useRef<() => Promise<File>>()

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Webcam not available on this device.")
    } else {
      setReady(true)
    }

    return () => {
      if (!streamRef.current) return
      for (const track of streamRef.current.getTracks()) {
        track.stop()
        streamRef.current.removeTrack(track)
      }
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (disabled) return
    if (!videoRef.current) return

    const vid = videoRef.current
    const cvs = document.createElement("canvas")
    const ctx = cvs.getContext("2d")!

    ;(async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: {facingMode: "environment"},
        })
        vid.srcObject = streamRef.current
        if (vid.paused) await vid.play()
      } catch (e) {
        if (e instanceof Error) {
          const message =
            e.name === "NotFoundError"
              ? "Webcam not connected to computer."
              : e.name === "NotAllowedError"
              ? "Your device has denied permission to use the camera. Please change this in your device settings."
              : e.message
          alert(message)
        }
        throw e
      } finally {
        setLoading(false)
      }
    })()

    let imgWidth = 0
    let imgHeight = 0
    let streaming = false

    captureRef.current = () => {
      return new Promise<File>((good, bad) => {
        if (!streaming) {
          const msg =
            "Webcam failed to load. Please turn off all other apps. Then restart this app."
          throw new Error(msg)
        }

        cvs.width = imgWidth
        cvs.height = imgHeight
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        const mime = "image/jpeg"

        cvs.toBlob((b) => {
          if (!b) return bad("Failed to convert canvas to blob.")
          const f = new File([b], Date.now() + ".jpeg", {type: mime})
          good(f)
        }, mime)
      })
    }

    const canplay = () => {
      if (streaming) return
      imgWidth = Math.min(vid.videoWidth, maxWidth)
      imgHeight = vid.videoHeight / (vid.videoWidth / imgWidth)
      streaming = true // ready to capture
    }

    vid.addEventListener("canplay", canplay)
    return () => vid.removeEventListener("canplay", canplay)
  }, [ready, disabled])

  return {
    ready,
    loading,
    disabled,
    videoRef,
    getFile: () => captureRef.current?.(),
  }
}
