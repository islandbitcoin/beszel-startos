import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:4',
  releaseNotes: {
    en_US: 'Register the Beszel daemon correctly so StartOS starts the service after exporting the web interface.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
