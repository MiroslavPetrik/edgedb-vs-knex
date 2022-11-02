"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};__exportStar(require("./external"), exports);
(function () {
  var edgedb_1 = require("edgedb");
  Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return edgedb_1.createClient; } });
})();
const $ = __importStar(require("./reflection"));
const $syntax = __importStar(require("./syntax"));
const $op = __importStar(require("./operators"));
const _std = __importDefault(
                require("./modules/std")).default;
const _cal = __importDefault(
                require("./modules/cal")).default;
const _cfg = __importDefault(
                require("./modules/cfg")).default;
const _default = __importDefault(
                require("./modules/default")).default;
const _schema = __importDefault(
                require("./modules/schema")).default;
const _sys = __importDefault(
                require("./modules/sys")).default;
const _math = __importDefault(
                require("./modules/math")).default;

const ExportDefault
 = {
  ..._std,
  ..._default,
  ...$.util.omitDollarPrefixed($syntax),
  ...$op,
  "std": _std,
  "cal": _cal,
  "cfg": _cfg,
  "default": _default,
  "schema": _schema,
  "sys": _sys,
  "math": _math,
};
const Cardinality = $.Cardinality;


exports.default = ExportDefault
Object.assign(exports, { Cardinality: Cardinality });
