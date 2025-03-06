// Emscripten adds a global "Module" object when "algo.js" loads.
// We'll wait until it's ready to call any compiled C functions.

Module.onRuntimeInitialized = function() {
  // 1) Wrap the C function "prob" using cwrap.
  //    'prob' returns a double, and takes (unsigned int*, double*, int) as parameters.
  const c_prob = Module.cwrap('prob', 'number', ['number', 'number', 'number']);
  const c_explen = Module.cwrap('explen', 'number', ['number', 'number', 'number']);
  /**
   * High-level JS helper: calls the C 'prob' function.
   * @param {number[]} graphArr - Array of positive integers (unsigned int in C)
   * @param {number[]} psArr    - Array of floats (double in C)
   * @param {number} [startIndex=2] - Start node index
   * @returns {number} Probability
   */
  function probability(graphArr, psArr, startIndex = 2) {
    // Convert JS arrays to typed arrays
    const graphTyped = new Uint32Array(graphArr);
    const psTyped    = new Float64Array(psArr);

    // Allocate memory in the WASM heap
    const graphBytes = graphTyped.length * graphTyped.BYTES_PER_ELEMENT;
    const graphPtr   = Module._malloc(graphBytes);
    Module.HEAPU32.set(graphTyped, graphPtr >> 2);

    const psBytes = psTyped.length * psTyped.BYTES_PER_ELEMENT;
    const psPtr   = Module._malloc(psBytes);
    Module.HEAPF64.set(psTyped, psPtr >> 3);

    // Call the C function
    const out = c_prob(graphPtr, psPtr, startIndex);

    // Free memory
    Module._free(graphPtr);
    Module._free(psPtr);

    return out;
  }  
  function expected_length(graphArr, psArr, startIndex = 2) {
    // Convert JS arrays to typed arrays
    const graphTyped = new Uint32Array(graphArr);
    const psTyped    = new Float64Array(psArr);

    // Allocate memory in the WASM heap
    const graphBytes = graphTyped.length * graphTyped.BYTES_PER_ELEMENT;
    const graphPtr   = Module._malloc(graphBytes);
    Module.HEAPU32.set(graphTyped, graphPtr >> 2);

    const psBytes = psTyped.length * psTyped.BYTES_PER_ELEMENT;
    const psPtr   = Module._malloc(psBytes);
    Module.HEAPF64.set(psTyped, psPtr >> 3);

    // Call the C function
    const out = c_explen(graphPtr, psPtr, startIndex);

    // Free memory
    Module._free(graphPtr);
    Module._free(psPtr);

    return out;
  }
  const N = 1000;
  const DELTA = 0.001;
  const ps = Array.from({ length: N }, (_, i) => i / N);

  const ctx = document.getElementById('p_chart');
  let pChart = new Chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
      labels: ps, // X-Axis labels
      datasets: [] // Initially empty, datasets will be added dynamically
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      scales: {
        x: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Probability of winning a point (p)',
            font: {
              weight: 'bold'
            }
          }
        },
        y: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Probability of winning match',
            font: {
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          displayColors: false
        }
      }
    }
  });  
  const ctx2 = document.getElementById('length_fairness_chart');

  const x_ds = Array.from({ length: N }, (_, i) => 15 * (i / N));
  const dataPoints = x_ds.map(x => ({ x: x, y: x * x }));
  let lenFairnessChart = new Chart(ctx2, {
    type: 'scatter',
    responsive: true,
    data: {
      datasets: [{
        label: 'Optimality threshold',
        data: dataPoints,
        showLine: true,
        fill: false,
        borderColor: '#2c3e50',
        backgroundColor: '#2c3e50',
        borderWidth: 2,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 15,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Fairness',
            font: {
              weight: 'bold'
            }
          },
        },
        y: {
          type: 'linear',
          min: 0,
          max: 225,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Expected length',
            font: {
              weight: 'bold'
            }
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          callbacks: {
            label: function(context) {
              return `Fairness: ${context.parsed.x.toFixed(2)}, Length: ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    }
  });

  // Add a resize observer to handle chart resizing
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      window.setTimeout(() => {
        if (pChart) pChart.resize();
        if (lenFairnessChart) lenFairnessChart.resize();
      }, 100);
    }
  });

  // Observe the chart containers
  resizeObserver.observe(document.querySelector('.charts-row'));
  
  // 2) When the button is clicked, read user input, call `probability`, show the result
  document.getElementById('run').addEventListener('click', function() {

    // Get the user input from CodeMirror if available, otherwise fallback to textarea
    let userCode;
    if (window.codeEditor) {
      userCode = window.codeEditor.getValue();
    } else {
      userCode = document.getElementById('code').value;
    }
  
    const graphData = __BRYTHON__.imported.runner.run_code(userCode);

    // Optionally, choose a start node. We'll just do 2 for example:
    const startNode = 2;

    // Call the Wasm function
    const vs = ps.map(p => probability(graphData, [p], 2));


    const dvs = [0.5, 0.5 + DELTA].map(p => probability(graphData, [p], 2));
    const fairness = (dvs[1] - dvs[0]) / DELTA;
    const el = expected_length(graphData, [0.5], 2);
    
    // Calculate margin (Expected Length - fairness^2)
    const fairnessSquared = fairness * fairness;
    const margin = el - fairnessSquared;
    
    // Update separate result elements
    document.getElementById('fairness-output').textContent = fairness.toFixed(2);
    document.getElementById('length-output').textContent = el.toFixed(2);
    
    // Format margin with sign and color based on value
    const marginOutput = document.getElementById('margin-output');
    marginOutput.textContent = (margin >= 0 ? '+' : '') + margin.toFixed(2);
    
    // Change margin color based on value (negative is good - below the threshold)
    if (margin < 0) {
      marginOutput.style.color = '#27ae60'; // Green for negative (good)
    } else {
      marginOutput.style.color = '#e74c3c'; // Red for positive (not good)
    }

    const dataset = {
        label: 'P(p)',
        data: vs,
        pointRadius: 0,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
    };
    if (pChart.data.datasets.length > 0) {
      pChart.data.datasets.pop();
    }
    pChart.data.datasets.push(dataset);
    pChart.update();

    if (lenFairnessChart.data.datasets.length > 1) {
      lenFairnessChart.data.datasets.pop();
    }
    lenFairnessChart.data.datasets.push({
        data: [{
            x: fairness,
            y: el,
        }],
        fill: true,
        borderColor: '#e74c3c',
        backgroundColor: '#e74c3c',
        pointRadius: 7,
        pointHoverRadius: 9,
        label: 'Your match',
    })
    lenFairnessChart.update();
    console.log(lenFairnessChart.data.datasets);
    // Display the result
  });





};