// main.js
import { computeGraph } from './compute';
import { probability, fairness, expectedLength } from './loadAlgo';
import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import {python} from "@codemirror/lang-python"


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


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const inputTextArea = document.getElementById("input") as HTMLTextAreaElement;
  const outputTextArea = document.getElementById("output") as HTMLTextAreaElement;
  const fairness_p = document.getElementById("fairness_p") as HTMLParagraphElement;
  const expected_length_p = document.getElementById("expected_length_p") as HTMLParagraphElement;
  const code_area = new EditorView({
    doc: start_code,
    parent: document.getElementById("code_area"),
    extensions: [basicSetup, python()]
  });
  runButton.addEventListener("click", async () => {
    outputTextArea.value = "running...";
    const result = await computeGraph(code_area.state.doc.toString());
    const fr = fairness(result);
    const el = expectedLength(result, 0.5);
    fairness_p.textContent = `Fairness: ${fr}`;
    expected_length_p.textContent = `Length: ${el}`;
  });

});