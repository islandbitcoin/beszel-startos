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

  const daemons = sdk.Daemons.of(effects)

  daemons.addDaemon('beszel', {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      env: {},
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
