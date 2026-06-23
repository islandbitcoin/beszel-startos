export const packageLogPrefix = 'beszel-startos'
export const serviceName = 'beszel'
export const subcontainerName = 'beszel'
export const webInterfaceId = 'web-ui'
export const webMultiHostId = 'web-multi'
export const httpPort = 8090
export const appUrl = 'https://beszel.embassy'

export const mountVolume = {
  volumeId: 'main' as const,
  subpath: null as string | null,
  mountpoint: '/beszel_data',
  readonly: false,
  type: 'directory' as const,
}

export function log(message: string, details?: unknown) {
  const prefix = `[${packageLogPrefix} ${new Date().toISOString()}]`
  if (details === undefined) {
    console.log(`${prefix} ${message}`)
  } else {
    console.log(`${prefix} ${message}`, details)
  }
}
