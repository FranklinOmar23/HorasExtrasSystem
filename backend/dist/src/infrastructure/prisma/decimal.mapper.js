"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalDesdeDb = decimalDesdeDb;
const decimal_js_1 = __importDefault(require("decimal.js"));
function decimalDesdeDb(valor) {
    return new decimal_js_1.default(valor.toString());
}
//# sourceMappingURL=decimal.mapper.js.map