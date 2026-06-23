import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:3',
  releaseNotes: {
    en_US: 'Fix package JavaScript permissions and keep detailed startup diagnostics for troubleshooting StartOS proxy issues.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
