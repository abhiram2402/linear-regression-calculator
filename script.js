displayEmptyGraph();
function displayEmptyGraph() {
    const layout = {
        title: "Linear Regression",
        xaxis: {
            title: "X Values",
        },
        yaxis: {
            title: "Y Values",
        },
        height: 500,
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50,
        },
    };

    const chartDiv = document.getElementById("regression-chart");

    // Create an empty plot initially
    Plotly.newPlot(chartDiv, [], layout);
}
function calculateRegression() {
    const xInput = document.getElementById("x").value;
    const yInput = document.getElementById("y").value;

    if (!xInput || !yInput) {
        showError("Please enter both X and Y values.");
        return;
    }

    const xArray = parseValues(xInput);
    const yArray = parseValues(yInput);

    if (!validateInput(xArray) || !validateInput(yArray)) {
        showError("Invalid input. Please enter valid numbers.");
        return;
    }

    if (xArray.length !== yArray.length) {
        showError("Number of X and Y values must match.");
        return;
    }

    const { slope, intercept, rsquared } = linearRegression(xArray, yArray);

    document.getElementById("slope").textContent = slope.toFixed(2);
    document.getElementById("intercept").textContent = intercept.toFixed(2);
    document.getElementById("equation").textContent = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
    document.getElementById("rsquared").textContent = rsquared.toFixed(2);

    // Calculate sum values
    const sumX2 = xArray.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = yArray.reduce((sum, y) => sum + y * y, 0);
    const sumXY = xArray.reduce((sum, x, i) => sum + x * yArray[i], 0);
    const sumX = xArray.reduce((sum, x) => sum + x, 0);
    const sumY = yArray.reduce((sum, y) => sum + y, 0);

    document.getElementById("sum-x2").textContent = sumX2.toFixed(2);
    document.getElementById("sum-y2").textContent = sumY2.toFixed(2);
    document.getElementById("sum-xy").textContent = sumXY.toFixed(2);
    document.getElementById("sum-x").textContent = sumX.toFixed(2);
    document.getElementById("sum-y").textContent = sumY.toFixed(2);

    clearError();
    displayGraph(xArray, yArray, slope, intercept);
}


function displayGraph(xArray, yArray, slope, intercept) {
    const chartData = [
        {
            x: xArray,
            y: yArray,
            mode: "markers",
            type: "scatter",
            name: "Data Points",
            marker: {
                size: 10,
                color: "#007bff",
            },
        },
        {
            x: xArray,
            y: xArray.map(x => slope * x + intercept),
            mode: "lines",
            type: "scatter",
            name: "Regression Line",
            line: {
                color: "#ff6347",
                width: 2,
            },
        }
    ];

    const layout = {
        title: "Linear Regression",
        xaxis: {
            title: "X Values",
        },
        yaxis: {
            title: "Y Values",
        },
        width: 700,  // Increase the width to your preferred value (e.g., 700px)
        height: 500, // Increase the height to your preferred value (e.g., 500px)
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50,
        },
    };

    const chartDiv = document.getElementById("regression-chart");

    Plotly.newPlot(chartDiv, chartData, layout);
}


function parseValues(input) {
    return input.split(",").map(value => parseFloat(value.trim()));
}

function validateInput(values) {
    return values.every(value => !isNaN(value));
}

function linearRegression(xValues, yValues) {
    const n = xValues.length;

    // Calculate the mean of x and y values
    const meanX = xValues.reduce((sum, value) => sum + value, 0) / n;
    const meanY = yValues.reduce((sum, value) => sum + value, 0) / n;

    // Calculate the coefficients
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (xValues[i] - meanX) * (yValues[i] - meanY);
        denominator += Math.pow(xValues[i] - meanX, 2);
    }

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    // Calculate R-squared
    let totalVariation = 0;
    let explainedVariation = 0;
    for (let i = 0; i < n; i++) {
        totalVariation += Math.pow(yValues[i] - meanY, 2);
        const predictedY = slope * xValues[i] + intercept;
        explainedVariation += Math.pow(predictedY - meanY, 2);
    }

    const rsquared = explainedVariation / totalVariation;

    return {
        slope,
        intercept,
        rsquared
    };
}

function showError(message) {
    const errorContainer = document.getElementById("error-container");
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = message;
    errorContainer.style.display = "block";
}

function clearError() {
    const errorContainer = document.getElementById("error-container");
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";
    errorContainer.style.display = "none";
}
