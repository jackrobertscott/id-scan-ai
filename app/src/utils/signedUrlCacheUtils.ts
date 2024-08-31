const signedUrlCache = new Map<
  string,
  {
    url: string
    expires: Date
  }
>()

export const getCachedSignedUrl = (
  key: string,
  url?: string
): string | undefined => {
  if (!url) return undefined
  const cached = signedUrlCache.get(key)

  if (cached && cached.expires > new Date()) {
    return cached.url
  }

  const urlObj = new URL(url)
  const amzDate = urlObj.searchParams.get("X-Amz-Date")
  const amzExpires = urlObj.searchParams.get("X-Amz-Expires")

  if (amzDate && amzExpires) {
    const formattedDate = amzDate.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
      "$1-$2-$3T$4:$5:$6Z"
    )
    const urlExpiryDate = new Date(formattedDate)
    urlExpiryDate.setSeconds(urlExpiryDate.getSeconds() + parseInt(amzExpires))
    signedUrlCache.set(key, {url, expires: urlExpiryDate})
    return url
  } else {
    return url
  }
}
