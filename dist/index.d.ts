/// <reference types="cypress" />
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
declare type ScreenshotOptions = Cypress.ScreenshotOptions;
export declare type MatchImageSnapshotOptionsType = ScreenshotOptions & MatchImageSnapshotOptions;
declare global {
    namespace Cypress {
        interface Chainable {
            matchImageSnapshot(nameOrOptions?: string | MatchImageSnapshotOptionsType): void;
            matchImageSnapshot(name: string, options: MatchImageSnapshotOptionsType): void;
        }
    }
}
export * from './command';
export * from './plugin';
export * from './reporter';
