"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// main.js
const compute_1 = require("./compute");
const loadAlgo_1 = require("./loadAlgo");
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    const runButton = document.getElementById("run");
    const inputTextArea = document.getElementById("input");
    const outputTextArea = document.getElementById("output");
    const fairness_p = document.getElementById("fairness_p");
    const expected_length_p = document.getElementById("expected_length_p");
    runButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        outputTextArea.value = "running...";
        const result = yield (0, compute_1.computeGraph)(inputTextArea.value);
        const fr = (0, loadAlgo_1.fairness)(result);
        const el = (0, loadAlgo_1.expectedLength)(result, 0.5);
        fairness_p.textContent = `Fairness: ${fr}`;
        expected_length_p.textContent = `Length: ${el}`;
    }));
});
