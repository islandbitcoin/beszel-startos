export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Beszel!': 0,
  'Beszel is ready': 1,
  'Beszel is still starting. If this persists, please check the logs.': 2,
  'Web Interface': 3,
  'Web-based dashboard for viewing system metrics and managing monitored systems': 4,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
