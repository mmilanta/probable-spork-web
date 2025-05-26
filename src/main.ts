// main.js
import { computeGraph } from './compute';
import { linspace, probability_parallel, fairness, expectedLength } from './loadAlgo';
import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import {python} from "@codemirror/lang-python"
import './styles.css';
import { Chart, registerables} from 'chart.js';


const start_code = `
s0 = (0,0)
N = 100
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
`
Chart.register(...registerables);


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const inputTextArea = document.getElementById("input") as HTMLTextAreaElement;
  const outputTextArea = document.getElementById("output") as HTMLTextAreaElement;
  const fairness_p = document.getElementById("fairness_p") as HTMLParagraphElement;
  const expected_length_p = document.getElementById("expected_length_p") as HTMLParagraphElement;
  const codeArea = new EditorView({
    doc: start_code,
    parent: document.getElementById("code_area") as HTMLDivElement,
    extensions: [basicSetup, python()]
  });
  var trace1 = {
    x: [0, 0.1, 0.2, .3, .4, .5, .6, .7, .8, .9, 1],
    y: [0, 0.1, 0.2, .3, .4, .5, .6, .7, .8, .9, 1],
    mode: 'lines',
  };

  var trace2 = {
    x: [.4,.6],
    y: [0,1],
    type: 'line'
  };

  var data = [trace1, trace2];
  const ctx_output_plot = document.getElementById('output_plot') as HTMLCanvasElement;
  const ctx_optimality_plot = document.getElementById('optimality_plot') as HTMLCanvasElement;
  const outputPlot = new Chart(ctx_output_plot, {
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
        data: [{x: 0.4, y: 0}, {x: 0.6, y: 1}],
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
            max: 1
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
    }
  );
  const optimalityPlot = new Chart(ctx_optimality_plot, {
    data: {
      datasets: [{
        type: "scatter",
        label: 'data',
        data: [{
          x: 0,
          y: 0
        }],
      },{
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
              text: 'p'
            }
          },
          y: {
            type: 'linear',
            position: 'bottom',
            min: 0,
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
    }
  );
  runButton.addEventListener("click", async () => {
    const result = await computeGraph(codeArea.state.doc.toString());
    const fr = fairness(result);
    const el = expectedLength(result, 0.5);
    const ps = linspace(0, 1, 0.01);
    const data = probability_parallel(result, ps);
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
    optimalityPlot.data.datasets[1].data = linspace(0, 1.5 * fr, 0.01).map(p => ({ x: p, y: p * p }));
    optimalityPlot.options.scales.x.max = 1.2 * fr;
    optimalityPlot.update();
  });
});