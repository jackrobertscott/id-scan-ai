import {app} from "electron"
import fs from "fs-extra"
import path from "path"
import {z, ZodObject} from "zod"

export class JsonStore<T extends ZodObject<any>> {
  private storePath: string
  private schema: T

  constructor(fileName: string, schema: T) {
    if (!fileName.endsWith(".json")) throw new Error(".json extension required")
    this.storePath = path.join(app.getPath("userData"), fileName)
    this.schema = schema
  }

  public patchValue(value: Partial<z.infer<T>>) {
    const newValue = this.getValue()
    Object.assign(newValue, value)
    this.schema.parse(newValue)
    fs.writeFileSync(this.storePath, JSON.stringify(newValue), {
      encoding: "utf8",
    })
  }

  public getValue(): z.infer<T> {
    try {
      const rawData = fs.readFileSync(this.storePath, "utf8")
      return JSON.parse(rawData)
    } catch {
      return {} as T
    }
  }
}
