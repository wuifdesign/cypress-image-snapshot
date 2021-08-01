/// <reference types="cypress" />
import { MatchImageSnapshotOptions } from 'jest-image-snapshot'

type ScreenshotOptions = Cypress.ScreenshotOptions

export type MatchImageSnapshotOptionsType = ScreenshotOptions & MatchImageSnapshotOptions

declare global {
  namespace Cypress {
    interface Chainable {
      matchImageSnapshot(nameOrOptions?: string | MatchImageSnapshotOptionsType): void

      matchImageSnapshot(name: string, options: MatchImageSnapshotOptionsType): void
    }
  }
}

export * from './command'
export * from './plugin'
export * from './reporter'
