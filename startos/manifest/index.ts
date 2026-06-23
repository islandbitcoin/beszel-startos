import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'beszel',
  title: 'Beszel',
  license: 'MIT',
  packageRepo: 'https://github.com/henrygd/beszel',
  upstreamRepo: 'https://github.com/henrygd/beszel',
  marketingUrl: 'https://beszel.dev',
  donationUrl: null,
  description: {
    short: {
      en_US: 'Lightweight server monitoring with Docker stats, historical data, and alerts.',
    },
    long: {
      en_US:
        'Beszel is a lightweight server monitoring platform that includes Docker statistics, historical data, and alert functions. ' +
        'It has a friendly web interface, simple configuration, and is ready to use out of the box. ' +
        'It supports automatic backup, multi-user OAuth authentication, and API access.',
    },
  },
  volumes: ['main'],
  images: {
    beszel: {
      source: { dockerTag: 'henrygd/beszel:0.18.7' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
