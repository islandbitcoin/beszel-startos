export declare const DEFAULT_LANG = "en_US";
declare const dict: {
    readonly 'Starting Beszel!': 0;
    readonly 'Beszel is ready': 1;
    readonly 'Beszel is still starting. If this persists, please check the logs.': 2;
    readonly 'Web Interface': 3;
    readonly 'Web-based dashboard for viewing system metrics and managing monitored systems': 4;
};
export type I18nKey = keyof typeof dict;
export type LangDict = Record<(typeof dict)[I18nKey], string>;
export default dict;
