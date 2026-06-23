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
type HttpProbeResult = {
    ok: true;
    statusCode: number | undefined;
    headers: Record<string, string | string[] | number | undefined>;
    bodyPreview: string;
    elapsedMs: number;
} | {
    ok: false;
    error: string;
    elapsedMs: number;
};
export declare function log(message: string, details?: unknown): void;
export declare function formatError(error: unknown): string;
export declare function logRootfsPath(rootfs: string, path: string, options?: {
    label: string;
    readText?: boolean;
}): Promise<void>;
export declare function probeHttpPort(port: number, path?: string): Promise<HttpProbeResult>;
export {};
