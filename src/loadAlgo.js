// load_module.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// loadAlgo.ts
export function loadWasmModule() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error
        const ModuleFactory = (yield import('./wasm/algo.js')).default;
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
export function probability(graph, p) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    return wasmInterface.probability(graph, [p]);
}
export function fairness(graph, delta = 0.0001) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    const p1 = probability(graph, 0.5);
    const p2 = probability(graph, 0.5 + delta);
    return (p2 - p1) / delta;
}
export function expectedLength(graph, p) {
    if (!wasmInterface) {
        throw new Error('WASM module not loaded');
    }
    return wasmInterface.expectedLength(graph, [p]);
}
export function linspace(start, stop, gap) {
    const result = [];
    for (let i = start; i <= stop; i += gap) {
        result.push(i);
    }
    return result;
}
export function probability_parallel(graph, ps) {
    const ys = ps.map((p) => probability(graph, p));
    return ys.map((y, i) => ({ x: ps[i], y }));
}
