declare const require: (moduleName: string) => unknown

type FileStat = {
  isDirectory(): boolean
  isFile(): boolean
  mode: number
  size: number
}

type FsPromises = {
  readdir(path: string): Promise<string[]>
  readFile(path: string, encoding: 'utf8'): Promise<string>
  stat(path: string): Promise<FileStat>
}

type HeaderValue = string | string[] | number | undefined

type HttpResponse = {
  statusCode?: number
  headers: Record<string, HeaderValue>
  setEncoding(encoding: 'utf8'): void
  on(event: 'data', callback: (chunk: string) => void): void
  on(event: 'end', callback: () => void): void
}

type HttpRequest = {
  on(event: 'timeout', callback: () => void): void
  on(event: 'error', callback: (error: unknown) => void): void
  destroy(error: Error): void
  end(): void
}

type HttpModule = {
  request(
    options: {
      hostname: string
      port: number
      path: string
      method: 'GET'
      timeout: number
    },
    callback: (res: HttpResponse) => void,
  ): HttpRequest
}

const { readdir, readFile, stat } = (require('fs') as { promises: FsPromises })
  .promises
const { request } = require('http') as HttpModule

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

type HttpProbeResult =
  | {
      ok: true
      statusCode: number | undefined
      headers: Record<string, HeaderValue>
      bodyPreview: string
      elapsedMs: number
    }
  | {
      ok: false
      error: string
      elapsedMs: number
    }

export function log(message: string, details?: unknown) {
  const prefix = `[${packageLogPrefix} ${new Date().toISOString()}]`
  if (details === undefined) {
    console.log(`${prefix} ${message}`)
  } else {
    console.log(`${prefix} ${message}`, details)
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

export async function logRootfsPath(
  rootfs: string,
  path: string,
  options: { label: string; readText?: boolean } = { label: path },
) {
  const fullPath = `${rootfs}${path}`

  try {
    const pathStat = await stat(fullPath)
    log(`${options.label} exists`, {
      path,
      fullPath,
      isDirectory: pathStat.isDirectory(),
      isFile: pathStat.isFile(),
      mode: `0${(pathStat.mode & 0o777).toString(8)}`,
      size: pathStat.size,
    })

    if (pathStat.isDirectory()) {
      const entries = await readdir(fullPath)
      log(`${options.label} directory entries`, {
        path,
        entries: entries.slice(0, 20),
        totalEntries: entries.length,
      })
    } else if (options.readText) {
      const content = await readFile(fullPath, 'utf8')
      log(`${options.label} content`, {
        path,
        content,
      })
    }
  } catch (error) {
    log(`${options.label} probe failed`, {
      path,
      fullPath,
      error: formatError(error),
    })
  }
}

export async function probeHttpPort(
  port: number,
  path = '/',
): Promise<HttpProbeResult> {
  const started = Date.now()

  return new Promise((resolve) => {
    const req = request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'GET',
        timeout: 5_000,
      },
      (res) => {
        let bodyPreview = ''
        res.setEncoding('utf8')

        res.on('data', (chunk) => {
          if (bodyPreview.length >= 1024) return
          const remaining = 1024 - bodyPreview.length
          bodyPreview += chunk.slice(0, remaining)
        })

        res.on('end', () => {
          resolve({
            ok: true,
            statusCode: res.statusCode,
            headers: sanitizeHeaders(res.headers),
            bodyPreview,
            elapsedMs: Date.now() - started,
          })
        })
      },
    )

    req.on('timeout', () => {
      req.destroy(new Error('HTTP probe timed out'))
    })

    req.on('error', (error) => {
      resolve({
        ok: false,
        error: formatError(error),
        elapsedMs: Date.now() - started,
      })
    })

    req.end()
  })
}

function sanitizeHeaders(headers: Record<string, HeaderValue>) {
  const sanitized: Record<string, HeaderValue> = {}

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'set-cookie') {
      sanitized[key] = '[redacted]'
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
