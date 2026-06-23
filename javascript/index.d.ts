export { createBackup } from './backups';
export { main } from './main';
export { init, uninit } from './init';
export declare const manifest: {
    id: "beszel";
    title: string;
    license: string;
    packageRepo: string;
    upstreamRepo: string;
    marketingUrl: string;
    donationUrl: null;
    description: {
        short: {
            en_US: string;
        };
        long: {
            en_US: string;
        };
    };
    volumes: "main"[];
    images: {
        beszel: {
            source: {
                dockerTag: string;
            };
            arch: ["x86_64", "aarch64"];
        };
    };
    dependencies: {};
} & import("@start9labs/start-sdk/base/lib/osBindings").Manifest;
