"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _command = require("./command");

Object.keys(_command).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _command[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _command[key];
    }
  });
});

var _plugin = require("./plugin");

Object.keys(_plugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _plugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _plugin[key];
    }
  });
});

var _reporter = require("./reporter");

Object.keys(_reporter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _reporter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _reporter[key];
    }
  });
});