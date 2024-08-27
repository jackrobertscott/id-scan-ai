import crypto from "crypto"
import {AsyncRequestListener} from "./serverUtils"

export function setSecurityHeaders(
  listener: AsyncRequestListener
): AsyncRequestListener {
  return async function (req, res) {
    // Set X-XSS-Protection header to prevent cross-site scripting (XSS) attacks
    res.setHeader("X-XSS-Protection", "1; mode=block")

    // Set X-Content-Type-Options header to prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff")

    // Set X-Frame-Options header to prevent clickjacking attacks
    res.setHeader("X-Frame-Options", "DENY")

    // Set Strict-Transport-Security header to enforce HTTPS connections
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )

    // Set Referrer-Policy header to control the Referer header
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

    // Set Feature-Policy header to control browser features
    res.setHeader(
      "Feature-Policy",
      "geolocation 'none'; microphone 'none'; camera 'none'"
    )

    // Set X-Memberted-Cross-Domain-Policies header to restrict Adobe Flash and PDF policies
    res.setHeader("X-Memberted-Cross-Domain-Policies", "none")

    // Set X-Download-Options header to prevent Internet Explorer from executing downloads in site's context
    res.setHeader("X-Download-Options", "noopen")

    // Generate a unique nonce for each request
    const nonce = crypto.randomBytes(16).toString("base64")
    res.setHeader("X-Content-Security-Policy-Nonce", nonce)
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self'; font-src 'self'; connect-src 'self'`
    )

    // Disable caching of sensitive data
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    )
    res.setHeader("Pragma", "no-cache")
    res.setHeader("Expires", "0")

    // Call the actual handler
    return listener(req, res)
  }
}
