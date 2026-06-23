import { sdk } from './sdk'
import {
  appUrl,
  httpPort,
  log,
  mountVolume,
  serviceName,
  subcontainerName,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  log('Setting up main service', {
    serviceName,
    httpPort,
    appUrl,
    mountpoint: mountVolume.mountpoint,
  })

  const mounts = sdk.Mounts.of().mountVolume(mountVolume)
  log('Mount configuration created', mountVolume)

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: serviceName },
    mounts,
    subcontainerName,
  )
  log('Subcontainer created', {
    imageId: serviceName,
    subcontainerName,
    rootfs: subcontainer.rootfs,
  })

  // The beszel Docker image is FROM scratch — it has no /etc/passwd or /etc/group.
  // start-container subcontainer exec requires these files to resolve the user,
  // so we write minimal entries before the daemon spawns commands.
  await subcontainer.writeFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/sh\n')
  await subcontainer.writeFile('/etc/group', 'root:x:0:\n')
  log('Wrote minimal account files for scratch image')

  log('Registering Beszel daemon', {
    daemon: serviceName,
    command: 'image entrypoint',
    env: {
      APP_URL: appUrl,
    },
  })

  let healthCheckAttempt = 0

  const daemons = sdk.Daemons.of(effects).addDaemon(serviceName, {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        APP_URL: appUrl,
      },
    },
    ready: {
      display: 'Web Interface',
      fn: async () => {
        healthCheckAttempt += 1
        log('Running Beszel readiness check', {
          attempt: healthCheckAttempt,
          url: `http://127.0.0.1:${httpPort}`,
        })

        const result = await sdk.healthCheck.checkWebUrl(
          effects,
          `http://127.0.0.1:${httpPort}`,
          {
            timeout: 60_000,
            successMessage: 'Beszel is ready',
            errorMessage: 'Beszel is still starting. If this persists, please check the logs.',
          },
        )
        log('Beszel SDK health check result', {
          attempt: healthCheckAttempt,
          result,
        })
        return result
      },
    },
    requires: [],
  })

  log('Main service setup complete', {
    daemon: serviceName,
  })
  return daemons
})
