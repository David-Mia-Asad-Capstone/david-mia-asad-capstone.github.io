

const margin = {top: 40, right: 60, bottom: 60, left: 60},
      width = 650 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const lineChart = d3.select("#container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Append the tooltip to the body
const lineTip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("padding", "8px")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("border-radius", "4px")
  .style("pointer-events", "none") 
  .style("opacity", 0);
  
const parseYear = d3.timeParse("%Y"); // I was using the wrong time format before and it caused my tooltip to be misaligned on both axis'

  d3.csv("data/overall_arrests.csv").then(data => {
      data.forEach(d => {
          d.arrest_year = parseYear(d.arrest_year);
          d.total_arrests = +d.total_arrests;
      });
      
    // Time Scale
    const x = d3.scaleTime()
      .domain([d3.min(data, d => d.arrest_year), d3.max(data, d => d.arrest_year)])
      .range([0, width]);
    // Linear Scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_arrests)])
        .range([height, 0]);
        
// setting up the line chart's axis'
    // SVG x-axis
    lineChart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("stroke", "none")
        .call(g => g.select(".domain").remove()); // Removes the x-axis grid line for a more sleek design

  // SVG y-axis 
    lineChart.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove()) // Removes the y-axis line for a more sleek design
    .style("stroke", "none");

// Setting up the line chart's grid lines
    // Add X grid lines
    const xAxisGrid = d3.axisBottom(x)
    .tickSize(-height) 
    .tickFormat("")

  // append the x-grid lines 
    lineChart.append("g")
    .attr("class", "x grid")
    .attr("transform", `translate(0,${height})`)
    .call(xAxisGrid)
    .style("stroke", "none")
    .call(g => g.select(".domain").remove()) // removes grid line from x-axis


    // Add Y grid lines
    const yAxisGrid = d3.axisLeft(y)
    .tickSize(-width)    
    .tickFormat("") 

    // append the y-grid lines 
    lineChart.append("g")
    .attr("class", "y grid")
    .call(yAxisGrid)
    .call(g => g.select(".domain").remove());  // removes grid line from y-axis
    
    lineChart.selectAll(".grid line")
    .style("stroke", "darkslategray")
    .style("stroke-dasharray", "1,1"); //first draft was set to "1,1"

    lineChart.selectAll("line")
    .style("stroke-dasharray", "1,1") //first draft was set to "1,1"
    .style("stroke", "darkslategray")
    
// Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // // Start of DataLine  // 
const dataLine = d3.line()
  .x(d => x(d.arrest_year))
  .y(d => y(d.total_arrests));
lineChart.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "#2171b5")
  .attr("stroke-width", 2.5)
  .attr("d", dataLine);
// line transitions were here before intersection observer

//End of Transitions for DataLine // //End of Transitions for DataLine // //End of Transitions for DataLine // //End of Transitions for DataLine // //End of Transitions for DataLine // //End of Transitions for DataLine // //End of Transitions for DataLine // 
// End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // // End of DataLine  // 
    lineChart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.arrest_year))
        .attr("cy", d => y(d.total_arrests))
        .attr("r", 3.25)
        .attr("stroke","#bdbdbd") 
        .attr("fill", "black")
  // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events //   // Tooltip Mouse Events // 
        .on("mouseenter", (event, d) => {
          lineTip.transition().duration(200).style("opacity", 0.9);
          lineTip.html(`
            <strong>Year:</strong> ${d.arrest_year.getFullYear()}<br>
            <strong>Total Arrests:</strong> ${d.total_arrests}<br>
          `)
          .style("top", (event.pageY - 28) + "px")
          .style("left", (event.pageX + 10) + "px");
        })
    .on("mousemove", (event) => {
      lineTip
            .style("left", (event.pageX ) + "px")
            .style("top", (event.pageY) + "px");
    })
    .on("mouseleave", () => {
      lineTip.transition().duration(200).style("opacity", 0);
    });
// End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // // End of Tooltip Mouse Events // 

//Circle Transitions – DONT MOVE THIS – IT WILL BREAK THE MOUSE EVENTS IF IT GOES BEFORE THEM // //Circle Transitions – DONT MOVE THIS – IT WILL BREAK THE MOUSE EVENTS IF IT GOES BEFORE THEM //    //Circle Transitions – DONT MOVE THIS – IT WILL BREAK THE MOUSE EVENTS IF IT GOES BEFORE THEM //   
    // Circle Transitions go here //
// End of Circle Transitions // // End of Circle Transitions // // End of Circle Transitions // // End of Circle Transitions // // End of Circle Transitions // // End of Circle Transitions // 

// Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // // Graphic Bylines+Sourcing  // 
    lineChart.append("text") 
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill","darkslategray")
        .style("font-size", "14px")
        .html(`<a href="https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u/about_data"> Arrests for All Offenses Related to Sex Work (2006-2024)</a>`);
    
        lineChart.append("text") 
        .attr("x", width  - 250)
        .attr("x", 330 - margin.left - 10)
        .attr("y", height + margin.top - 360)
        .style("text-anchor", "middle")
        .style("text-align", "center")
        .style("fill","darkslategray")
        .style("font-size", "14px")
        .html(`<a href="https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u/about_data"> Decrease in Arrests for All Offenses Related to Sex Work (2006-2024)</a>`);

        lineChart.append("text")
        .attr("x", width - 350)
        .attr("y", height + margin.bottom -24)
        .style("font-size", "12px")
        .style("text-align", "center")
        .style("fill","darkslategray")
        .html(`<a href="https://docs.google.com/spreadsheets/d/11Ge52fU1DwHbgF7b2fVX_7G5akqe3DsdU5l4bmEUKJo/edit?usp=sharing">Source: NYPD/NYC Open Data</a>`);

        lineChart.append("text")
        .attr("x", width - 325)
        .attr("y", height + margin.bottom -8)
        .style("font-size", "12px")
        .style("text-align", "center")
        .style("fill","darkslategray")
        .html(`<a href="https://www.linkedin.com/in/david-paiz-torres-494b3614a/">By:David Paiz-Torres</a>`);
        
});
// End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // // End of Graphic Bylines+Sourcing  // 


  // // // Media Query 
  // const mediaQuery = window.matchMedia('(max-width: 450px), only screen and (orientation: portrait), not (orientation:landscape)');
  // if (mediaQuery.matches) {
  //   // alert('Media Query Matched!')//the alert is a placeholder to make sure the matchMedia method is working

  //   const newWidth = document.body.clientWidth - 360;
  //   const newHeight = 400 - margin.top - margin.bottom;
    
  //   width = newWidth;
  //   height = newHeight;
    
  //   lineChart.attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom);
  // }
