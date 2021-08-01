"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchImageSnapshotOptions = matchImageSnapshotOptions;
exports.matchImageSnapshotResult = matchImageSnapshotResult;
exports.matchImageSnapshotPlugin = matchImageSnapshotPlugin;
exports.addMatchImageSnapshotPlugin = addMatchImageSnapshotPlugin;
exports.cachePath = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _pkgDir = _interopRequireDefault(require("pkg-dir"));

var _constants = require("./constants");

var _diffSnapshot = require("jest-image-snapshot/src/diff-snapshot");

const _excluded = ["failureThreshold", "failureThresholdType", "customSnapshotsDir", "customDiffDir"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

let snapshotOptions = {};
let snapshotResult = {};
let snapshotRunning = false;
const kebabSnap = '-snap.png';
const dotSnap = '.snap.png';
const dotDiff = '.diff.png';

const cachePath = _path.default.join(_pkgDir.default.sync(process.cwd()) || '', 'cypress', '.snapshot-report');

exports.cachePath = cachePath;

function matchImageSnapshotOptions(options = {}) {
  return () => {
    snapshotOptions = options;
    snapshotRunning = true;
    return null;
  };
}

function matchImageSnapshotResult() {
  return () => {
    snapshotRunning = false;
    const {
      pass,
      added,
      updated
    } = snapshotResult; // @todo is there a less expensive way to share state between test and reporter?

    if (!pass && !added && !updated && _fsExtra.default.existsSync(cachePath)) {
      const cache = JSON.parse(_fsExtra.default.readFileSync(cachePath, 'utf8'));
      cache.push(snapshotResult);

      _fsExtra.default.writeFileSync(cachePath, JSON.stringify(cache), 'utf8');
    }

    return snapshotResult;
  };
}

function matchImageSnapshotPlugin({
  path: screenshotPath
}) {
  if (!snapshotRunning) {
    return undefined;
  }

  const {
    screenshotsFolder,
    updateSnapshots,
    options: {
      failureThreshold = 0,
      failureThresholdType = 'pixel',
      customSnapshotsDir = null,
      customDiffDir = null
    } = {}
  } = snapshotOptions,
        options = _objectWithoutProperties(snapshotOptions.options, _excluded);

  if (screenshotsFolder) {
    const receivedImageBuffer = _fsExtra.default.readFileSync(screenshotPath);

    _fsExtra.default.removeSync(screenshotPath);

    const {
      dir: screenshotDir,
      name
    } = _path.default.parse(screenshotPath); // remove the cypress v5+ native retries suffix from the file name


    const snapshotIdentifier = name.replace(/ \(attempt [0-9]+\)/, '');

    const relativePath = _path.default.relative(screenshotsFolder, screenshotDir);

    const snapshotsDir = customSnapshotsDir ? _path.default.join(process.cwd(), customSnapshotsDir, relativePath) : _path.default.join(screenshotsFolder, '..', 'snapshots', relativePath);

    const snapshotKebabPath = _path.default.join(snapshotsDir, `${snapshotIdentifier}${kebabSnap}`);

    const snapshotDotPath = _path.default.join(snapshotsDir, `${snapshotIdentifier}${dotSnap}`);

    const diffDir = customDiffDir ? _path.default.join(process.cwd(), customDiffDir, relativePath) : _path.default.join(snapshotsDir, '__diff_output__');

    const diffDotPath = _path.default.join(diffDir, `${snapshotIdentifier}${dotDiff}`);

    if (_fsExtra.default.pathExistsSync(snapshotDotPath)) {
      _fsExtra.default.copySync(snapshotDotPath, snapshotKebabPath);
    }

    snapshotResult = (0, _diffSnapshot.diffImageToSnapshot)(_objectSpread({
      snapshotsDir,
      diffDir,
      receivedImageBuffer,
      snapshotIdentifier,
      failureThreshold,
      failureThresholdType,
      updateSnapshot: updateSnapshots
    }, options));
    const {
      pass,
      added,
      updated,
      diffOutputPath
    } = snapshotResult;

    if (diffOutputPath && !pass && !added && !updated) {
      _fsExtra.default.copySync(diffOutputPath, diffDotPath);

      _fsExtra.default.removeSync(diffOutputPath);

      _fsExtra.default.removeSync(snapshotKebabPath);

      snapshotResult.diffOutputPath = diffDotPath;
      return {
        path: diffDotPath
      };
    }

    _fsExtra.default.copySync(snapshotKebabPath, snapshotDotPath);

    _fsExtra.default.removeSync(snapshotKebabPath);

    snapshotResult.diffOutputPath = snapshotDotPath;
    return {
      path: snapshotDotPath
    };
  }

  return undefined;
}

function addMatchImageSnapshotPlugin(on, config) {
  on('task', {
    [_constants.MATCH]: matchImageSnapshotOptions(config),
    [_constants.RECORD]: matchImageSnapshotResult()
  });
  on('after:screenshot', matchImageSnapshotPlugin);
}