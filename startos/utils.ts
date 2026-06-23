import { readdir, readFile, stat } from 'node:fs/promises'
import { request, type IncomingHttpHeaders } from 'node:http'

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
      headers: Record<string, string | string[] | number | undefined>
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
        const chunks: Buffer[] = []
        let capturedBytes = 0

        res.on('data', (chunk: Buffer) => {
          if (capturedBytes >= 1024) return
          const remaining = 1024 - capturedBytes
          const slice = chunk.subarray(0, remaining)
          chunks.push(slice)
          capturedBytes += slice.length
        })

        res.on('end', () => {
          resolve({
            ok: true,
            statusCode: res.statusCode,
            headers: sanitizeHeaders(res.headers),
            bodyPreview: Buffer.concat(chunks).toString('utf8'),
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

function sanitizeHeaders(headers: IncomingHttpHeaders) {
  const sanitized: Record<string, string | string[] | number | undefined> = {}

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'set-cookie') {
      sanitized[key] = '[redacted]'
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
