// main.js
import { computeGraph } from './compute.ts';
import { probability, fairness, expectedLength } from './loadAlgo.ts';

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const inputTextBox = document.getElementById("input") as HTMLButtonElement;
  const outputTextBox = document.getElementById("output") as HTMLButtonElement;

  runButton.addEventListener("click", async () => {
    outputTextBox.value = "running...";
    const result = await computeGraph(inputTextBox.value);
    const fr = fairness(result);
    const el = expectedLength(result, 0.5);
    outputTextBox.value = `Fairness: ${fr}\nExpected Length: ${el}`;;
  });
});