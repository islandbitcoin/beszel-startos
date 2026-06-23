export const httpPort = 8090

export const mountVolume = {
  volumeId: 'main' as const,
  subpath: null as string | null,
  mountpoint: '/beszel_data',
  readonly: false,
}
