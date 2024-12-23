const bar_margin = { top: 80, right: 240, bottom: 80, left: 240 },
  bar_width = 950 - bar_margin.left - bar_margin.right,
  // bar_width = document.body.clientWidth + 120;
  bar_height = 400 - bar_margin.top - bar_margin.bottom;

const bar_container = d3.select('#bar_container');
const barYear = d3.timeParse("%Y");

const barChart = bar_container.append('barChart')
  .append("svg")
  .attr("width", bar_width + bar_margin.left + bar_margin.right)
  .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
  .append("g")
  .attr("transform", `translate(${bar_margin.left},${bar_margin.top})`); 1 
// Tooltip
const barTip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("padding", "8px")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("opacity", 0);

// Parse the data
d3.csv("data/demographics.csv").then(function(data) {

// get counts for the datappints + sort them in descending order
  const raceCounts = d3.rollup(data, v => v.length, d => d.PERP_RACE);
  const raceCountArray = Array.from(raceCounts.entries())
    .sort((a, b) => b[1] - a[1]); // sort the data in descending order 
 
  // scales
  const x = d3.scaleLinear()
    .domain([0, d3.max(raceCountArray, d => d[1])])
    .range([5, bar_width]);

  const y = d3.scaleBand()
    .range([0, bar_height])
    .domain(raceCountArray.map(d => d[0]))
    .padding(0.1);

  // Create the bars for chart
  barChart.selectAll("rect") 
    .data(raceCountArray)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1]))
    .attr("height", y.bandwidth())
    .attr("fill","#2171b5",)
    
    .on("mouseenter", (event, d) => {
      barTip.transition().duration(200).style("opacity", 0.9);
      barTip.html(`
        <strong>Arrest as a Percentage:</strong> ${(d[1] / 186 * 100).toFixed(2)}%<br>
        <strong>Total Arrests:</strong> ${(d[1])}<br>
      `)
        .style("top", (event.pageY - 28) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
   
    .on("mousemove", (event) => {
      barTip
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px");
    })
    .on("mouseleave", () => {
      barTip.transition().duration(200).style("opacity", 0);
    });

  // X axis
  barChart.append("g")
    .attr("transform", `translate(0,${bar_height})`)
    .call(d3.axisBottom(x))
    
    .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  barChart.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

    barChart.selectAll("line.vertical-grid")
    .data(x.ticks(0))
    .enter()
    .append("line")
    .attr("class", "vertical-grid")
    .attr("x1", function (d) { return x(d); })
    .attr("y1", 30) // Reduces height of gridlines from top so they don't go past the bars.
    .attr("x2", function (d) { return x(d); })
    .attr("y2", bar_height )
    .style("stroke", "gray")
    .style("stroke-width", 0.5)
    .style("stroke-dasharray", "2 2");
});

barChart.append("text") 
.attr("x", 330 - bar_margin.left - 50)
.attr("y", bar_height + bar_margin.top - 333)
.style("text-align", "center")
.style("fill","darkslategray")
.style("font-size", "14px")
.html(`<a href="https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u/about_data">Arrest Rates for Prostitution by Race/Ethnicity in Queens (2021-2024)</a>`);


barChart.append("text")
.attr("x", bar_width - 330)
.attr("y", bar_height + bar_margin.bottom -30)
.style("font-size", "12px")
.style("text-align", "center")
.style("fill","darkslategray")
.html(`<a href="https://docs.google.com/spreadsheets/d/11Ge52fU1DwHbgF7b2fVX_7G5akqe3DsdU5l4bmEUKJo/edit?usp=sharing">Source: NYPD/NYC Open Data</a>`);

barChart.append("text")
  .attr("x", bar_width - 300)
  .attr("y", bar_height + bar_margin.bottom -15)
  .style("font-size", "12px")
  .style("text-align", "center")
  .style("fill","darkslategray")
  .html(`<a href="https://www.linkedin.com/in/david-paiz-torres-494b3614a/">By:David Paiz-Torres</a>`);

  // const barQuery = window.matchMedia('(max-width: 450px)')
  // if (barQuery.matches){
  //   alert('Bar Query Matched!') //the alert is a placeholder to make sure the matchMedia method is working
  // }