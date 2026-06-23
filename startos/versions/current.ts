import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:1',
  releaseNotes: {
    en_US: 'Fix startup under StartOS by adding minimal account files for the scratch image and setting the public app URL.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
