// main.js
import { assert } from 'console';
import { computeGraph } from './compute.ts';
import { probability, fairness } from './loadAlgo.ts';

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const inputTextBox = document.getElementById("input") as HTMLButtonElement;
  const outputTextBox = document.getElementById("output") as HTMLButtonElement;

  runButton.addEventListener("click", async () => {
    console.log("Run button clicked");
    const result = await computeGraph(inputTextBox.value);
    console.log("Runned");
    const prob = fairness(result);
    console.log(prob);
    outputTextBox.value = prob?.toString() || "0";
  });
});