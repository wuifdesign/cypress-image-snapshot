/// <reference types="cypress" />
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
export declare type MatchImageSnapshotCommandOptionsType = MatchImageSnapshotOptions & Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions>;
export declare function matchImageSnapshotCommand(defaultOptions: MatchImageSnapshotCommandOptionsType): (subject: string, maybeName: string | MatchImageSnapshotCommandOptionsType, commandOptions?: MatchImageSnapshotCommandOptionsType) => Cypress.Chainable<unknown>;
export declare function addMatchImageSnapshotCommand(maybeName: string | MatchImageSnapshotCommandOptionsType, maybeOptions?: MatchImageSnapshotCommandOptionsType): void;
