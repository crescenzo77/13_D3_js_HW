    
// @TODO: YOUR CODE HERE!
// set the width and height parameters to be used in later in the plotted table
let svgWidth = 900;
let svgHeight = 600;

// Set svg margins 
let margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// Create the width and height based svg margins and parameters to fit chart group within the plot area
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create the plot to append the SVG group that contains the states data
// Give the plot width and height calling the variables predifined.
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the plot area
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
let csvFile = "assets/data/data.csv"

// Function is called and passes csv data
d3.csv(csvFile).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objects
// If error exist it will be only visible in console
function errorHandle(error) {
  throw err;
}

// Function takes in argument csvData
function successHandle(csvData) {
  console.log(csvData);

  // Loop through the data and pass argument data
  csvData.map(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  //  Create scale functions
  // Linear Scale takes the min to be displayed in axis, and the max of the data
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d.poverty) -2, d3.max(csvData, d => d.poverty) + 2])
    .range([0, width]);

  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d=> d.healthcare)-2, d3.max(csvData, d => d.healthcare)+2])
    .range([height, 0]);

  // Create axis functions by calling the scale functions

  let bottomAxis = d3.axisBottom(xLinearScale)
    // Adjust the number of ticks for the bottom axis  
    .ticks(10);
  let leftAxis = d3.axisLeft(yLinearScale);




  // Append the axes to the chart group 
  // Bottom axis moves using height 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Left axis is already at 0,0
  // Only append the left axis 
  chartGroup.append("g")
    .call(leftAxis);


  // Create Circles for scatter plot
  // something's not right... please give notes on where i went wrong?
  let circleGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


  // Append text to circles 

  let circlesGroup = chartGroup.selectAll()
    .data(csvData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

// setup tooltip
  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>healthcare: ${d.healthcare}% `);
    });

  // Create tooltip in chart
  chartGroup.call(toolTip);

  // make event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // define the onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack of Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}