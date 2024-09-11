interface UserAgentDetails {
  browser: string | null
  browserVersion: string | null
  os: string | null
  osVersion: string | null
  device: string | null
  deviceModel: string | null
  cpuArchitecture: string | null
  engine: string | null
  engineVersion: string | null
}

export function parseUserAgent(
  userAgent: string | null | undefined
): UserAgentDetails {
  const details: UserAgentDetails = {
    browser: null,
    browserVersion: null,
    os: null,
    osVersion: null,
    device: null,
    deviceModel: null,
    cpuArchitecture: null,
    engine: null,
    engineVersion: null,
  }

  if (!userAgent) {
    return details
  }

  // Extract browser and version
  const browserRegexes: [RegExp, string][] = [
    [/Firefox\/([0-9.]+)/, "Firefox"],
    [/Chrome\/([0-9.]+)/, "Chrome"],
    [/Safari\/([0-9.]+)/, "Safari"],
    [/MSIE\s([0-9.]+)/, "Internet Explorer"],
    [/Trident\/.*rv:([0-9.]+)/, "Internet Explorer"],
    [/OPR\/([0-9.]+)/, "Opera"],
    [/Edge\/([0-9.]+)/, "Edge"],
  ]

  for (const [regex, browserName] of browserRegexes) {
    const match = userAgent.match(regex)
    if (match) {
      details.browser = browserName
      details.browserVersion = match[1]
      break
    }
  }

  // Extract OS and version
  const osRegexes: [RegExp, string][] = [
    [/Windows NT ([0-9.]+)/, "Windows"],
    [/Mac OS X ([0-9._]+)/, "macOS"],
    [/Android ([0-9.]+)/, "Android"],
    [/iOS ([0-9._]+)/, "iOS"],
    [/Linux/, "Linux"],
  ]

  for (const [regex, osName] of osRegexes) {
    const match = userAgent.match(regex)
    if (match) {
      details.os = osName
      details.osVersion = match[1] ? match[1].replace(/_/g, ".") : null
      break
    }
  }

  // Determine device type and model
  if (userAgent.includes("Mobile")) {
    details.device = "Mobile"
    const mobileDeviceRegex = /(iPhone|iPad|iPod|Android|BlackBerry|IEMobile)/
    const deviceMatch = userAgent.match(mobileDeviceRegex)
    if (deviceMatch) {
      details.deviceModel = deviceMatch[1]
    }
  } else if (userAgent.includes("Tablet")) {
    details.device = "Tablet"
  } else {
    details.device = "Desktop"
  }

  // Extract CPU architecture
  if (userAgent.includes("x64") || userAgent.includes("x86_64")) {
    details.cpuArchitecture = "x64"
  } else if (userAgent.includes("x86") || userAgent.includes("i686")) {
    details.cpuArchitecture = "x86"
  } else if (userAgent.includes("arm")) {
    details.cpuArchitecture = "ARM"
  }

  // Extract rendering engine and version
  const engineRegexes: [RegExp, string][] = [
    [/AppleWebKit\/([0-9.]+)/, "WebKit"],
    [/Gecko\/([0-9.]+)/, "Gecko"],
    [/Trident\/([0-9.]+)/, "Trident"],
    [/Blink\/([0-9.]+)/, "Blink"],
  ]

  for (const [regex, engineName] of engineRegexes) {
    const match = userAgent.match(regex)
    if (match) {
      details.engine = engineName
      details.engineVersion = match[1]
      break
    }
  }

  return details
}
