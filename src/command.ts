/// <reference types="cypress" />
import { MATCH, RECORD } from './constants'
import { MatchImageSnapshotOptions } from 'jest-image-snapshot'

const screenshotsFolder = Cypress.config('screenshotsFolder')
const updateSnapshots = Cypress.env('updateSnapshots') || false
const failOnSnapshotDiff = typeof Cypress.env('failOnSnapshotDiff') === 'undefined'

export type ImageSnapshotOptions = {
  sizes: [number, number][]
}

export type MatchImageSnapshotCommandOptionsType =
  | ImageSnapshotOptions &
      MatchImageSnapshotOptions &
      Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions>

export function matchImageSnapshotCommand(defaultOptions: MatchImageSnapshotCommandOptionsType) {
  return function matchImageSnapshot(
    subject: string,
    maybeName: string | MatchImageSnapshotCommandOptionsType,
    commandOptions?: MatchImageSnapshotCommandOptionsType
  ) {
    const options: MatchImageSnapshotCommandOptionsType = {
      ...defaultOptions,
      ...((typeof maybeName === 'string' ? commandOptions : maybeName) || {})
    }

    cy.task(MATCH, {
      screenshotsFolder,
      updateSnapshots,
      options
    })

    const name = typeof maybeName === 'string' ? maybeName : undefined
    const target = subject ? cy.wrap(subject) : cy
    if (name) {
      target.screenshot(name, options)
    } else {
      target.screenshot(options)
    }

    return cy.task(RECORD).then((data: any) => {
      const { pass, added, updated, diffSize, imageDimensions, diffRatio, diffPixelCount, diffOutputPath } = data
      if (Object.keys(data).length > 0) {
        if (!pass && !added && !updated) {
          let message: string
          if (diffSize) {
            message = `Image size (${imageDimensions?.baselineWidth}x${imageDimensions?.baselineHeight}) different than saved snapshot size (${imageDimensions?.receivedWidth}x${imageDimensions?.receivedHeight}).\nSee diff for details: ${diffOutputPath}`
          } else {
            const diffSizeString = typeof diffRatio !== 'undefined' ? diffRatio * 100 : '???'
            message = `Image was ${diffSizeString}% different from saved snapshot with ${diffPixelCount} different pixels.\nSee diff for details: ${diffOutputPath}`
          }
          if (failOnSnapshotDiff) {
            throw new Error(message)
          } else {
            Cypress.log({ message })
          }
        }
      }
    })
  }
}

export function addMatchImageSnapshotCommand(
  maybeName: string | MatchImageSnapshotCommandOptionsType,
  maybeOptions?: MatchImageSnapshotCommandOptionsType
) {
  const options = typeof maybeName === 'string' ? maybeOptions : maybeName
  const name = typeof maybeName === 'string' ? maybeName : 'matchImageSnapshot'
  Cypress.Commands.add(
    name,
    { prevSubject: ['optional', 'element', 'window', 'document'] },
    matchImageSnapshotCommand(options as MatchImageSnapshotCommandOptionsType)
  )
}
