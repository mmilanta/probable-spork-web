"use strict";
// load_module.js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.loadWasmModule = loadWasmModule;
exports.probability = probability;
exports.fairness = fairness;
exports.expectedLength = expectedLength;
// loadAlgo.ts
function loadWasmModule() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error
        const ModuleFactory = (yield Promise.resolve().then(() => __importStar(require('./wasm/algo.js')))).default;
        const Module = yield ModuleFactory();
        const c_prob = Module.cwrap('prob', 'number', ['number', 'number', 'number']);
        const c_explen = Module.cwrap('explen', 'number', ['number', 'number', 'number']);
        function callWasmFunc(fn, graphArr, psArr, startIndex = 2) {
            const graphTyped = new Uint32Array(graphArr);
            const psTyped = new Float64Array(psArr);
            const graphPtr = Module._malloc(graphTyped.length * graphTyped.BYTES_PER_ELEMENT);
            Module.HEAPU32.set(graphTyped, graphPtr >> 2);
            const psPtr = Module._malloc(psTyped.length * psTyped.BYTES_PER_ELEMENT);
            Module.HEAPF64.set(psTyped, psPtr >> 3);
            const result = fn(graphPtr, psPtr, startIndex);
            Module._free(graphPtr);
            Module._free(psPtr);
            return result;
        }
        function probability(graphArr, psArr, startIndex) {
            return callWasmFunc(c_prob, graphArr, psArr, startIndex);
        }
        function expectedLength(graphArr, psArr, startIndex) {
            return callWasmFunc(c_explen, graphArr, psArr, startIndex);
        }
        console.log;
        return { probability, expectedLength };
    });
}
let wasmInterface = null;
loadWasmModule().then((api) => {
    wasmInterface = api;
});
function probability(graph, p) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    return wasmInterface.probability(graph, [p]);
}
function fairness(graph, delta = 0.0001) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    const p1 = probability(graph, 0.5);
    const p2 = probability(graph, 0.5 + delta);
    return (p2 - p1) / delta;
}
function expectedLength(graph, p) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    return wasmInterface.expectedLength(graph, [p]);
}
