import jwt from "jsonwebtoken"
import {srvConf} from "../srvConf"

export async function jwtCreate(
  payload: object,
  secret: string = srvConf.JWT_SECRET,
  expires: string | number = "7d" // e.g. '10h': Token expires in 10 hours
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({...payload}, secret, {expiresIn: expires}, (err, token) => {
      if (err) {
        reject(err)
        return
      }
      resolve(token!)
    })
  })
}

export async function jwtVerify(
  token: string,
  secret: string = srvConf.JWT_SECRET
): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err)
        return
      }
      resolve(decoded)
    })
  })
}

export async function jwtRefresh(
  token: string,
  secret: string,
  expires: string | number // e.g. '10h': Token expires in 10 hours
): Promise<string> {
  const decoded = await jwtVerify(secret, token)
  return jwtCreate(decoded, secret, expires)
}
