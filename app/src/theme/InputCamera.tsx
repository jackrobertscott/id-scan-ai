import {css} from "@emotion/css"
import {mdiCamera, mdiCameraOff, mdiLoading, mdiScanner, mdiSync} from "@mdi/js"
import {FC, useEffect, useState} from "react"
import {desktopBridge, isDesktopAvailable} from "../desktopBridge"
import {gcn} from "../gcn"
import {useAlertManager} from "../mods/alert/alert_manager"
import {prettyCns} from "../utils/classNames"
import {imgUtil} from "../utils/imgUtil"
import {useWebcam} from "../utils/useWebcam"
import {Button} from "./Button"
import {Icon} from "./Icon"
import {Spacer} from "./Spacer"

export const InputCamera: FC<{
  label?: string
  loading?: boolean
  minHeight?: string
  value?: File | null
  onValue?: (value: File | null) => void
  enableScanner?: boolean
}> = ({label, value, loading, minHeight, onValue, enableScanner}) => {
  const webcam = useWebcam()
  const alertManager = useAlertManager()
  const [previewUrl, setPreviewUrl] = useState<string>()

  const onCameraPhoto = () => {
    webcam.getFile()?.then((img) => onValue?.(img))
  }

  const onScan = async () => {
    const dataUrl = await desktopBridge.twainScanBase64()
    if (!dataUrl) return alertManager.create("Scan failed")
    let imgData = await imgUtil.fromSource(dataUrl)
    if (imgData.height > imgData.width) imgData = imgUtil.rotate90(imgData, 1)
    imgData = imgUtil.shrink(imgData, 1280) // shrink for faster upload
    const f = await imgUtil.toFile(imgData)
    onValue?.(f)
  }

  const onClearValue = () => {
    onValue?.(null)
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

  return (
    <Spacer direction="column" slim grow noBasis>
      <div className={cn_ic.positioner} style={{"--min-height": minHeight}}>
        {webcam.ready && (
          <video
            autoPlay
            playsInline
            ref={webcam.videoRef}
            className={cn_ic.video}
            style={{"--display": previewUrl ? "none" : "block"}}
          />
        )}

        {previewUrl ? (
          <img src={previewUrl} className={cn_ic.previewImg} />
        ) : webcam.loading || webcam.disabled ? (
          <div className={cn_ic.centerIcon}>
            {webcam.loading ? (
              <Icon icon={mdiLoading} spinning />
            ) : (
              <Icon icon={mdiCameraOff} />
            )}
          </div>
        ) : null}
      </div>

      <Spacer direction="row" slim mobileCollapse>
        {value || loading ? (
          <Button
            label="Retake"
            icon={mdiSync}
            loading={loading}
            onClick={onClearValue}
          />
        ) : (
          <>
            {!webcam.loading && (
              <Button
                label={label ?? "Capture"}
                icon={mdiCamera}
                loading={webcam.loading}
                onClick={onCameraPhoto}
                bgColor="var(--bg-blu)"
              />
            )}
            {isDesktopAvailable() && enableScanner && (
              <Button
                label="Scan"
                icon={mdiScanner}
                loading={loading}
                onClick={onScan}
                bgColor="var(--bg-grn)"
              />
            )}
          </>
        )}
      </Spacer>
    </Spacer>
  )
}

const cn_ic = prettyCns("InputCamera", {
  positioner: css`
    ${gcn.depress}
    flex-grow: 1;
    min-height: var(--min-height, 10rem);
    position: relative;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  `,
  video: css`
    /* width: 100%; */
    height: 100%;
    flex-grow: 1;
    flex-basis: 0;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    display: var(--display);
  `,
  previewImg: css`
    /* width: 100%; */
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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
    white-space: nowrap;
    transform: translateX(-50%);
    background-color: var(--bg-clr);
  `,
})
