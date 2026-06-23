import { sdk } from './sdk'
import { httpPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const webInterface = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'web-ui',
    description: 'Web-based dashboard for viewing system metrics and managing monitored systems',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const multi = sdk.MultiHost.of(effects, 'web-multi')
  const multiOrigin = await multi.bindPort(httpPort, { protocol: 'http' })
  const receipt = await multiOrigin.export([webInterface])
  return [receipt]
})
