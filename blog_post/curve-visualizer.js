// curve-visualizer.js
class CurveVisualizer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default values
    this.currentIndex = 1;
    this.charts = [];
    this.color1 = "rgb(255, 102, 0)";
    this.color2 = "rgb(0, 102, 255)";
    
    // Create the structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .chart-container {
          position: relative;
        }
        canvas {
          display: block;
          margin: auto;
        }
        .slider-container {
          text-align: center;
          margin-top: 20px;
        }
      </style>
      <div class="container">
        <div class="chart-container">
          <canvas id="chart1" width="500" height="500"></canvas>
        </div>
        <div class="chart-container">
          <canvas id="chart2" width="500" height="500"></canvas>
        </div>
      </div>
      
      <div class="slider-container">
        <label for="curveSlider">Select Curve (1-19): </label>
        <input type="range" id="curveSlider" min="1" max="19" value="1">
        <span id="sliderValue">1</span>
      </div>
    `;
  }

  connectedCallback() {
    // Load Chart.js from CDN if it's not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.initializeComponent();
      document.head.appendChild(script);
    } else {
      this.initializeComponent();
    }
  }

  initializeComponent() {
    // Wait for Chart.js to be available
    if (!window.Chart) {
      setTimeout(() => this.initializeComponent(), 100);
      return;
    }

    // Get references to elements
    this.ctx1 = this.shadowRoot.getElementById('chart1');
    this.ctx2 = this.shadowRoot.getElementById('chart2');
    this.slider = this.shadowRoot.getElementById('curveSlider');
    this.sliderValueDisplay = this.shadowRoot.getElementById('sliderValue');

    // Get data from attributes or use placeholders
    this.plotData = this.getDataFromAttribute('plot-data');
    this.expectedValues = this.getDataFromAttribute('expected-values');
    this.derivatives = this.getDataFromAttribute('derivatives');

    // Set up event listeners
    this.slider.addEventListener("input", () => {
      const newIndex = parseInt(this.slider.value);
      if (newIndex !== this.currentIndex) {
        this.sliderValueDisplay.textContent = newIndex;
        this.animateTransition(newIndex);
      }
    });

    // Initialize charts if data is available
    if (this.plotData && this.expectedValues && this.derivatives) {
      this.initializeCharts();
    }

    // Dispatch event that component is ready
    this.dispatchEvent(new CustomEvent('ready'));
  }

  getDataFromAttribute(name) {
    const attr = this.getAttribute(name);
    return attr ? JSON.parse(attr) : null;
  }

  // Method to set data programmatically
  setData(plotData, expectedValues, derivatives) {
    this.plotData = plotData;
    this.expectedValues = expectedValues;
    this.derivatives = derivatives;
    
    if (this.charts.length > 0) {
      this.updateChartsWithData();
    } else {
      // Initialize charts if they don't exist yet
      this.initializeCharts();
    }
  }

  updateChartsWithData() {
    if (!this.plotData || !this.expectedValues || !this.derivatives) {
      console.error('Missing data for charts');
      return;
    }

    // Update chart data
    this.charts[0].data.datasets[0].data = this.plotData[this.currentIndex];
    this.charts[0].data.datasets[1].data = [
      { x: (1 - (1 / this.derivatives[this.currentIndex])) / 2, y: 0 },
      { x: (1 + (1 / this.derivatives[this.currentIndex])) / 2, y: 1 }
    ];
    this.charts[1].data.datasets[0].data = this.expectedValues[this.currentIndex];
    
    // Update charts
    this.charts[0].update();
    this.charts[1].update();
  }

  initializeCharts() {
    // Check if data is available
    if (!this.plotData || !this.expectedValues || !this.derivatives) {
      console.warn('Missing data for charts. Charts will be initialized when data is provided.');
      return;
    }
    
    // Check if canvas contexts are available
    if (!this.ctx1 || !this.ctx2) {
      console.error('Canvas elements not found');
      return;
    }

    this.charts[0] = new Chart(this.ctx1, {
      type: 'line',
      data: {
        datasets: [
          {
            label: `p1`,
            data: this.plotData[this.currentIndex],
            borderColor: this.color1
          },
          {
            label: `dp1`,
            data: [
              { x: (1 - (1 / this.derivatives[this.currentIndex])) / 2, y: 0 },
              { x: (1 + (1 / this.derivatives[this.currentIndex])) / 2, y: 1 }
            ],
            borderDash: [5, 5],
            borderColor: this.color1
          }
        ]
      },
      options: {
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 1
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
          }
        }
      }
    });

    this.charts[1] = new Chart(this.ctx2, {
      type: 'line',
      data: {
        datasets: [
          {
            label: `Expected 1`,
            data: this.expectedValues[this.currentIndex],
            borderColor: this.color2
          }
        ]
      },
      options: {
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 1
          },
          y: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 35
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
          }
        }
      }
    });
  }

  interpolateData(oldData, newData, steps = 20) {
    let frames = [];
    for (let t = 0; t <= steps; t++) {
      let progress = t / steps;
      let interpolated = oldData.map((point, i) => ({
        x: point.x + progress * (newData[i].x - point.x),
        y: point.y + progress * (newData[i].y - point.y)
      }));
      frames.push(interpolated);
    }
    return frames;
  }

  animateTransition(newIndex) {
    const oldCurve1 = this.charts[0].data.datasets[0].data;
    const oldDerivative1 = this.charts[0].data.datasets[1].data;
    const oldCurve2 = this.charts[1].data.datasets[0].data;

    const newCurve1 = this.plotData[newIndex];
    const newDerivative1 = [
      { x: (1 - (1 / this.derivatives[newIndex])) / 2, y: 0 },
      { x: (1 + (1 / this.derivatives[newIndex])) / 2, y: 1 }
    ];
    const newCurve2 = this.expectedValues[newIndex];

    let curveFrames1 = this.interpolateData(oldCurve1, newCurve1);
    let derivativeFrames1 = this.interpolateData(oldDerivative1, newDerivative1);
    let curveFrames2 = this.interpolateData(oldCurve2, newCurve2);

    let frameIndex = 0;
    const step = () => {
      if (frameIndex < curveFrames1.length) {
        this.charts[0].data.datasets[0].data = curveFrames1[frameIndex];
        this.charts[0].data.datasets[1].data = derivativeFrames1[frameIndex];
        this.charts[1].data.datasets[0].data = curveFrames2[frameIndex];

        this.charts[0].update();
        this.charts[1].update();
        
        frameIndex++;
        requestAnimationFrame(step);
      } else {
        this.charts[0].data.datasets[0].data = newCurve1;
        this.charts[0].data.datasets[1].data = newDerivative1;
        this.charts[1].data.datasets[0].data = newCurve2;

        this.charts[0].update();
        this.charts[1].update();
        this.currentIndex = newIndex;
      }
    };
    
    step();
  }

  // Getters and setters for component properties
  get maxCurves() {
    return parseInt(this.slider.max);
  }
  
  set maxCurves(value) {
    this.slider.max = value;
  }
  
  get currentCurve() {
    return this.currentIndex;
  }
  
  set currentCurve(value) {
    if (value >= 1 && value <= this.maxCurves) {
      this.slider.value = value;
      this.sliderValueDisplay.textContent = value;
      this.animateTransition(value);
    }
  }
}

// Register the custom element
customElements.define('curve-visualizer', CurveVisualizer);