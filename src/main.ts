// main.js
import { computeGraph } from './compute';
import { probability, fairness, expectedLength } from './loadAlgo';

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const inputTextArea = document.getElementById("input") as HTMLTextAreaElement;
  const outputTextArea = document.getElementById("output") as HTMLTextAreaElement;
  const fairness_p = document.getElementById("fairness_p") as HTMLParagraphElement;
  const expected_length_p = document.getElementById("expected_length_p") as HTMLParagraphElement;

  runButton.addEventListener("click", async () => {
    outputTextArea.value = "running...";
    const result = await computeGraph(inputTextArea.value);
    const fr = fairness(result);
    const el = expectedLength(result, 0.5);
    fairness_p.textContent = `Fairness: ${fr}`;
    expected_length_p.textContent = `Length: ${el}`;
  });
});