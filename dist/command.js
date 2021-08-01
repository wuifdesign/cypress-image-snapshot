"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchImageSnapshotCommand = matchImageSnapshotCommand;
exports.addMatchImageSnapshotCommand = addMatchImageSnapshotCommand;

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const screenshotsFolder = Cypress.config('screenshotsFolder');
const updateSnapshots = Cypress.env('updateSnapshots') || false;
const failOnSnapshotDiff = typeof Cypress.env('failOnSnapshotDiff') === 'undefined';

function matchImageSnapshotCommand(defaultOptions) {
  return function matchImageSnapshot(subject, maybeName, commandOptions) {
    const options = _objectSpread(_objectSpread({}, defaultOptions), (typeof maybeName === 'string' ? commandOptions : maybeName) || {});

    cy.task(_constants.MATCH, {
      screenshotsFolder,
      updateSnapshots,
      options
    });
    const name = typeof maybeName === 'string' ? maybeName : undefined;
    const target = subject ? cy.wrap(subject) : cy;

    if (name) {
      target.screenshot(name, options);
    } else {
      target.screenshot(options);
    }

    return cy.task(_constants.RECORD).then(data => {
      const {
        pass,
        added,
        updated,
        diffSize,
        imageDimensions,
        diffRatio,
        diffPixelCount,
        diffOutputPath
      } = data;

      if (Object.keys(data).length > 0) {
        if (!pass && !added && !updated) {
          let message;

          if (diffSize) {
            message = `Image size (${imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.baselineWidth}x${imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.baselineHeight}) different than saved snapshot size (${imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.receivedWidth}x${imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.receivedHeight}).\nSee diff for details: ${diffOutputPath}`;
          } else {
            const diffSizeString = typeof diffRatio !== 'undefined' ? diffRatio * 100 : '???';
            message = `Image was ${diffSizeString}% different from saved snapshot with ${diffPixelCount} different pixels.\nSee diff for details: ${diffOutputPath}`;
          }

          if (failOnSnapshotDiff) {
            throw new Error(message);
          } else {
            Cypress.log({
              message
            });
          }
        }
      }
    });
  };
}

function addMatchImageSnapshotCommand(maybeName, maybeOptions) {
  const options = typeof maybeName === 'string' ? maybeOptions : maybeName;
  const name = typeof maybeName === 'string' ? maybeName : 'matchImageSnapshot';
  Cypress.Commands.add(name, {
    prevSubject: ['optional', 'element', 'window', 'document']
  }, matchImageSnapshotCommand(options));
}