import {css} from "@emotion/css"
import {mdiCamera, mdiCameraOff, mdiLoading, mdiSync} from "@mdi/js"
import {FC, useEffect, useState} from "react"
import {useCnStatic} from "../utils/classNames"
import {useWebcam} from "../utils/useWebcam"
import {Button} from "./Button"
import {Icon} from "./Icon"

export const InputCamera: FC<{
  label?: string
  loading?: boolean
  minHeight?: string
  value?: File | null
  onValue?: (value: File | null) => void
}> = ({label, value, loading, minHeight, onValue}) => {
  const webcam = useWebcam()
  const [previewUrl, setPreviewUrl] = useState<string>()

  const handleCapture = () => {
    if (value) {
      onValue?.(null)
    } else {
      webcam.getFile()?.then((img) => onValue?.(img))
    }
  }

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      }
    } else {
      if (previewUrl) setPreviewUrl(undefined)
    }
  }, [value])

  const cn = useCnStatic("input-camera", () => ({
    root: css`
      flex-grow: 1;
      min-height: ${minHeight ?? "10rem"};
      position: relative;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `,
    video: css`
      flex-grow: 1;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      object-position: center;
      display: ${previewUrl ? "none" : "block"};
    `,
    previewImg: css`
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    `,
    centerIcon: css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
    `,
    button: css`
      left: 50%;
      bottom: 1rem;
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    `,
  }))

  return (
    <div className={cn.root}>
      {webcam.ready && (
        <video
          autoPlay
          playsInline
          ref={webcam.videoRef}
          className={cn.video}
        />
      )}

      {previewUrl ? (
        <img src={previewUrl} className={cn.previewImg} />
      ) : webcam.loading || webcam.disabled ? (
        <div className={cn.centerIcon}>
          {webcam.loading ? (
            <Icon icon={mdiLoading} spinning />
          ) : (
            <Icon icon={mdiCameraOff} />
          )}
        </div>
      ) : null}

      {!webcam.loading && (
        <div className={cn.button}>
          <Button
            icon={value ? mdiSync : mdiCamera}
            label={value ? "Retake" : label ?? "Capture"}
            loading={loading || webcam.loading}
            onClick={handleCapture}
          />
        </div>
      )}
    </div>
  )
}
