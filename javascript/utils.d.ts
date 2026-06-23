export declare const packageLogPrefix = "beszel-startos";
export declare const serviceName = "beszel";
export declare const subcontainerName = "beszel";
export declare const webInterfaceId = "web-ui";
export declare const webMultiHostId = "web-multi";
export declare const httpPort = 8090;
export declare const appUrl = "https://beszel.embassy";
export declare const mountVolume: {
    volumeId: "main";
    subpath: string | null;
    mountpoint: string;
    readonly: boolean;
    type: "directory";
};
export declare function log(message: string, details?: unknown): void;
