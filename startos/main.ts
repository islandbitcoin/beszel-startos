import { sdk } from './sdk'
import { httpPort, mountVolume } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const mounts = sdk.Mounts.of().mountVolume(mountVolume)

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'beszel' },
    mounts,
    'beszel',
  )

  // The beszel Docker image is FROM scratch — it has no /etc/passwd or /etc/group.
  // start-container subcontainer exec requires these files to resolve the user,
  // so we write minimal entries before the daemon spawns commands.
  await subcontainer.writeFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/sh\n')
  await subcontainer.writeFile('/etc/group', 'root:x:0:\n')

  const daemons = sdk.Daemons.of(effects)

  daemons.addDaemon('beszel', {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        APP_URL: 'https://beszel.embassy',
      },
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://127.0.0.1:${httpPort}`,
          {
            timeout: 60_000,
            successMessage: 'Beszel is ready',
            errorMessage: 'Beszel is still starting. If this persists, please check the logs.',
          },
        ),
    },
    requires: [],
  })

  return daemons
})
