import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:2',
  releaseNotes: {
    en_US: 'Add detailed startup, interface, filesystem, and readiness diagnostics for troubleshooting StartOS proxy issues.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
