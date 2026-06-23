import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:5',
  releaseNotes: {
    en_US: 'Polish package metadata and keep the working daemon registration with cleaner startup logs.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
