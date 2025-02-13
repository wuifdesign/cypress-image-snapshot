import { diffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot'
import { matchImageSnapshotOptions, matchImageSnapshotPlugin } from '../src/plugin'
import * as path from 'path'

jest.mock('jest-image-snapshot/src/diff-snapshot', () => ({
  diffImageToSnapshot: jest.fn().mockReturnValue({ diffOutputPath: '/path/to/diff' })
}))
jest.mock('fs-extra', () => ({
  readFileSync: () => 'cheese',
  pathExistsSync: () => false,
  copySync: () => null,
  removeSync: () => null
}))

describe('plugin', () => {
  it('should pass options through', () => {
    const originalCwd = process.cwd
    process.cwd = () => ''

    const options: any = {
      screenshotsFolder: '/cypress/screenshots',
      updateSnapshots: true
    }

    matchImageSnapshotOptions(options)()

    const result = matchImageSnapshotPlugin({
      path: '/cypress/screenshots/path/to/cheese'
    })
    expect(result).toEqual({
      path: path.normalize('/cypress/snapshots/path/to/__diff_output__/cheese.diff.png')
    })
    expect(diffImageToSnapshot).toHaveBeenCalledWith({
      snapshotsDir: path.normalize('/cypress/snapshots/path/to'),
      diffDir: path.normalize('/cypress/snapshots/path/to/__diff_output__'),
      updateSnapshot: true,
      receivedImageBuffer: 'cheese',
      snapshotIdentifier: 'cheese',
      failureThreshold: 0,
      failureThresholdType: 'pixel'
    })

    process.cwd = originalCwd
  })
})
