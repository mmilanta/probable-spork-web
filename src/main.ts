// main.js
import { computeGraph } from './compute';
import { linspace, probability_parallel, fairness, expectedLength } from './loadAlgo';
import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import {python} from "@codemirror/lang-python"
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
    parent: document.getElementById("code_area"),
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
  const ctx = document.getElementById('output_plot') as HTMLCanvasElement;
  const chartInstance = new Chart(ctx, {
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
  runButton.addEventListener("click", async () => {
    const result = await computeGraph(codeArea.state.doc.toString());
    const fr = fairness(result);
    const el = expectedLength(result, 0.5);
    const ps = linspace(0, 1, 0.01);
    const data = probability_parallel(result, ps);
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[1].data = [
      { x: 0.5 - (1 / (2 * fr)), y: 0 },
      { x: 0.5 + (1 / (2 * fr)), y: 1 }
    ];
    chartInstance.update();
    fairness_p.textContent = `Fairness: ${fr}`;
    expected_length_p.textContent = `Length: ${el}`;
  });
});