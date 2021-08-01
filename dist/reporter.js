"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _termImg = _interopRequireDefault(require("term-img"));

var _chalk = _interopRequireDefault(require("chalk"));

var _plugin = require("./plugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// <reference types="cypress" />
function fallback() {// do nothing
}

function reporter(runner) {
  _fsExtra.default.writeFileSync(_plugin.cachePath, JSON.stringify([]), 'utf8');

  runner.on('end', () => {
    const cache = JSON.parse(_fsExtra.default.readFileSync(_plugin.cachePath, 'utf8'));

    if (cache.length) {
      console.log(_chalk.default.red(`\n  (${_chalk.default.underline.bold('Snapshot Diffs')})`));
      cache.forEach(({
        diffRatio,
        diffPixelCount,
        diffOutputPath
      }) => {
        console.log(`\n  - ${diffOutputPath}\n    Screenshot was ${diffRatio * 100}% 
          different from saved snapshot with ${diffPixelCount} different pixels.\n`);
        (0, _termImg.default)(diffOutputPath, {
          fallback
        });
      });
    }

    _fsExtra.default.removeSync(_plugin.cachePath);
  });
}

var _default = reporter;
exports.default = _default;