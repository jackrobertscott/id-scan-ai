import {jwtCreate, jwtVerify} from "../../utils/jwtUtils"
import {DeviceType} from "../device/device_storeDef.iso"
import {getDeviceAuthSchema} from "./auth_device.iso"

export const createDeviceAuthToken = async (device: DeviceType) => {
  const payload = getDeviceAuthSchema().parse({
    deviceId: device.id,
    name: device.name,
  })
  return {
    token: await jwtCreate(payload),
    payload,
  }
}

export const digestDeviceAuthToken = async (token: string) => {
  const payload = await jwtVerify(token)
  return getDeviceAuthSchema().parse(payload)
}
