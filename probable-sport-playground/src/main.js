// main.js
import { computeGraph, loadBrython } from './compute.js';

document.addEventListener("DOMContentLoaded", () => {
  const runButton = document.getElementById("run");
  const inputTextBox = document.getElementById("input");
  const outputTextBox = document.getElementById("output");

  runButton.addEventListener("click", async () => {
    console.log("Run button clicked");
    const result = await computeGraph(inputTextBox.value);
    console.log("Runned");
    outputTextBox.value = result;
  });
});