/// <reference types="cypress" />
import fs from 'fs-extra'
import termImage from 'term-img'
import chalk from 'chalk'
import { cachePath } from './plugin'
import { Runner } from 'mocha'

function fallback() {
  // do nothing
}

function reporter(runner: Runner) {
  fs.writeFileSync(cachePath, JSON.stringify([]), 'utf8')

  runner.on('end', () => {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'))
    if (cache.length) {
      console.log(chalk.red(`\n  (${chalk.underline.bold('Snapshot Diffs')})`))

      cache.forEach(({ diffRatio, diffPixelCount, diffOutputPath }: any) => {
        console.log(
          `\n  - ${diffOutputPath}\n    Screenshot was ${diffRatio * 100}% 
          different from saved snapshot with ${diffPixelCount} different pixels.\n`
        )
        termImage(diffOutputPath, { fallback })
      })
    }

    fs.removeSync(cachePath)
  })
}

export default reporter
