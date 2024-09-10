import {z} from "zod"
import {JsonStore} from "./jsonStore"

export type DesktopConfigSchema = z.infer<
  ReturnType<typeof getDesktopConfigSchema>
>

export const getDesktopConfigSchema = () =>
  z.object({
    winPos: getWinPosSchema().optional(),
  })

export type WinPosSchema = () => z.infer<ReturnType<typeof getWinPosSchema>>

const getWinPosSchema = () =>
  z.object({
    width: z.number(),
    height: z.number(),
    x: z.number(),
    y: z.number(),
  })

export const dskConf = new JsonStore("app_conf.json", getDesktopConfigSchema())
