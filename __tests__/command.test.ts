declare namespace NodeJS {
  interface Global {
    Cypress: any
    cy: any
  }
}

declare let cy: any
declare let Cypress: any

global.Cypress = {
  env: () => undefined,
  log: () => null,
  config: () => '/cypress/screenshots',
  Commands: {
    add: jest.fn()
  }
}

global.cy = {
  wrap: (subject) => subject
}

const { matchImageSnapshotCommand, addMatchImageSnapshotCommand } = require('../src/command')

const defaultOptions = {
  failureThreshold: 0,
  failureThresholdType: 'pixel'
}

const boundMatchImageSnapshot = matchImageSnapshotCommand(defaultOptions).bind({
  test: 'snap'
})
const subject = { screenshot: jest.fn() }
const commandOptions = {
  failureThreshold: 10
}

describe('command', () => {
  it('should pass options through', () => {
    global.cy.task = jest.fn().mockResolvedValue({ pass: true })

    boundMatchImageSnapshot(subject, commandOptions)

    expect(cy.task).toHaveBeenCalledWith('Matching image snapshot', {
      screenshotsFolder: '/cypress/screenshots',
      updateSnapshots: false,
      options: {
        failureThreshold: 10,
        failureThresholdType: 'pixel'
      }
    })
  })

  it('should pass', () => {
    global.cy.task = jest.fn().mockResolvedValue({ pass: true })

    expect(boundMatchImageSnapshot(subject, commandOptions)).resolves.not.toThrow()
  })

  it('should fail', () => {
    global.cy.task = jest.fn().mockResolvedValue({
      pass: false,
      added: false,
      updated: false,
      diffRatio: 0.1,
      diffPixelCount: 10,
      diffOutputPath: 'cheese'
    })

    expect(boundMatchImageSnapshot(subject, commandOptions)).rejects.toThrowErrorMatchingSnapshot()
  })

  it('should add command', () => {
    Cypress.Commands.add.mockReset()
    addMatchImageSnapshotCommand()
    expect(Cypress.Commands.add).toHaveBeenCalledWith(
      'matchImageSnapshot',
      { prevSubject: ['optional', 'element', 'window', 'document'] },
      expect.any(Function)
    )
  })

  it('should add command with custom name', () => {
    Cypress.Commands.add.mockReset()
    addMatchImageSnapshotCommand('sayCheese')
    expect(Cypress.Commands.add).toHaveBeenCalledWith(
      'sayCheese',
      { prevSubject: ['optional', 'element', 'window', 'document'] },
      expect.any(Function)
    )
  })

  it('should add command with options', () => {
    Cypress.Commands.add.mockReset()
    addMatchImageSnapshotCommand({ failureThreshold: 0.1 })
    expect(Cypress.Commands.add).toHaveBeenCalledWith(
      'matchImageSnapshot',
      { prevSubject: ['optional', 'element', 'window', 'document'] },
      expect.any(Function)
    )
  })
})
