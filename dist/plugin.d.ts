/// <reference types="cypress" />
declare type ScreenshotDetails = Cypress.ScreenshotDetails;
declare type AfterScreenshotReturnObject = Cypress.AfterScreenshotReturnObject;
declare type ConfigOptions = Cypress.ConfigOptions;
declare type PluginEvents = Cypress.PluginEvents;
declare type ImageDimensions = {
    receivedHeight: number;
    receivedWidth: number;
    baselineHeight: number;
    baselineWidth: number;
};
declare type SnapshotOptionsOptionsType = {
    failureThreshold: number;
    failureThresholdType: 'percent' | 'pixel';
    customSnapshotsDir?: string;
    customDiffDir?: string;
};
declare type SnapshotOptionsType = ConfigOptions & {
    updateSnapshots?: boolean;
    options?: SnapshotOptionsOptionsType;
};
export declare type SnapshotResultType = {
    pass?: boolean;
    added?: boolean;
    updated?: boolean;
    diffSize?: boolean;
    imageDimensions?: ImageDimensions;
    diffOutputPath?: string;
    diffRatio?: number;
    diffPixelCount?: number;
    imgSrcString?: string;
};
export declare const cachePath: string;
export declare function matchImageSnapshotOptions(options?: SnapshotOptionsType): () => any;
export declare function matchImageSnapshotResult(): () => SnapshotResultType;
export declare function matchImageSnapshotPlugin({ path: screenshotPath }: ScreenshotDetails): void | AfterScreenshotReturnObject | Promise<AfterScreenshotReturnObject>;
export declare function addMatchImageSnapshotPlugin(on: PluginEvents, config: ConfigOptions): void;
export {};
