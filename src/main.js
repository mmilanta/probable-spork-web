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
const codemirror_1 = require("codemirror");
const view_1 = require("@codemirror/view");
const lang_python_1 = require("@codemirror/lang-python");
require("./styles.css");
const chart_js_1 = require("chart.js");
const start_code = `
s0 = (0,0)
N = 7
def play_fn(state, next_point: bool):
    if next_point:
        state = (state[0] + 1, state[1])
    else:
        state = (state[0], state[1] + 1)
    if state[0] == N:
        return GameEnd.WIN
    if state[1] == N:
        return GameEnd.LOSE
    return state
`;
chart_js_1.Chart.register(...chart_js_1.registerables);
document.addEventListener("DOMContentLoaded", () => {
    const runButton = document.getElementById("run");
    const inputTextArea = document.getElementById("input");
    const outputTextArea = document.getElementById("output");
    const balanced_p = document.getElementById("balanced_p");
    const fairness_p = document.getElementById("fairness_p");
    const expected_length_p = document.getElementById("expected_length_p");
    const codeArea = new view_1.EditorView({
        doc: start_code,
        parent: document.getElementById("code_area"),
        extensions: [codemirror_1.basicSetup, (0, lang_python_1.python)()]
    });
    var trace1 = {
        x: [0, 0.1, 0.2, .3, .4, .5, .6, .7, .8, .9, 1],
        y: [0, 0.1, 0.2, .3, .4, .5, .6, .7, .8, .9, 1],
        mode: 'lines',
    };
    var trace2 = {
        x: [.4, .6],
        y: [0, 1],
        type: 'line'
    };
    var data = [trace1, trace2];
    const ctx_output_plot = document.getElementById('output_plot');
    const ctx_optimality_plot = document.getElementById('optimality_plot');
    const outputPlot = new chart_js_1.Chart(ctx_output_plot, {
        type: 'line',
        data: {
            datasets: [{
                    label: 'data',
                    data: [{
                            x: 0,
                            y: 0
                        }, {
                            x: 1,
                            y: 1
                        }],
                    borderColor: 'rgb(75, 192, 192)',
                },
                {
                    label: 'fairness line',
                    data: [{ x: 0.4, y: 0 }, { x: 0.6, y: 1 }],
                    borderColor: 'rgb(255, 99, 132)',
                }],
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'p'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'P(Match, p)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `P(Match, p)`,
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        }
    });
    const optimalityPlot = new chart_js_1.Chart(ctx_optimality_plot, {
        data: {
            datasets: [{
                    type: "scatter",
                    label: 'data',
                    data: [{
                            x: 0,
                            y: 0
                        }],
                }, {
                    type: "line",
                    label: 'threshold',
                    data: [{
                            x: 0,
                            y: 0
                        }],
                    pointRadius: 0,
                }],
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    title: {
                        display: true,
                        text: 'F(Match, 0.5)'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    title: {
                        display: true,
                        text: 'E(Match, 0.5)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `Title`,
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        }
    });
    runButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, compute_1.computeGraph)(codeArea.state.doc.toString());
        const fr = (0, loadAlgo_1.fairness)(result);
        const el = (0, loadAlgo_1.expectedLength)(result, 0.5);
        const ps = (0, loadAlgo_1.linspace)(0, 1, 0.01);
        const data = (0, loadAlgo_1.probability_parallel)(result, ps);
        outputPlot.data.datasets[0].data = data;
        outputPlot.data.datasets[1].data = [
            { x: 0.5 - (1 / (2 * fr)), y: 0 },
            { x: 0.5 + (1 / (2 * fr)), y: 1 }
        ];
        outputPlot.update();
        optimalityPlot.data.datasets[0].data = [{
                x: fr,
                y: el
            }];
        // python eqivalent: optimalityPlot.data.datasets[1].data = [{"x": x, "y": x ** 2} for x in range(0, fr * 1.1, 0.01)]
        optimalityPlot.data.datasets[1].data = (0, loadAlgo_1.linspace)(0, 1.5 * fr, 0.01).map(p => ({ x: p, y: p * p }));
        optimalityPlot.options.scales.x.max = 1.2 * fr;
        optimalityPlot.update();
        // copute correct game
        const half_point = Math.floor(ps.length / 2);
        let error = 0;
        for (let i = 0; i < half_point; i++) {
            const x = data[i + 1].y;
            const y = data[ps.length - 1 - i].y;
            error += (x + y - 1) ** 2;
        }
        const balanced = error < 1e-10;
        // update fairness and expected length
        if (balanced) {
            balanced_p.textContent = `✅ The match is balanced, player 1 has no advantage over player 2`;
        }
        else {
            balanced_p.textContent = `❌ The match is not balanced, player 1 has an advantage over player 2`;
        }
        fairness_p.textContent = `Fairness(Match, 0.5): ${fr.toFixed(4)}`;
        expected_length_p.innerHTML = `Expected Length(Match, 0.5): ${el.toFixed(4)}`;
    }));
});
