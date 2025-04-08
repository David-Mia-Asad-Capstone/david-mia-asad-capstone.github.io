function renderBarChart() {  
d3.select("#bar_container").select("svg").remove();
  // Set default dimensions for larger screens.
  let bar_margin = { top: 80, right: 240, bottom: 80, left: 240 };
  let baseWidth = 950;
  let baseHeight = 400;
  
 
  if (window.innerWidth <= 450) {
   bar_margin = { top: 20, right: 10, bottom: 30, left: 40 };
    baseWidth = 300;
    baseHeight = 200;
     
  }
 
  const bar_width = baseWidth - bar_margin.left - bar_margin.right;
  const bar_height = baseHeight - bar_margin.top - bar_margin.bottom;
  
 // svg setup
  const svg = d3.select("#bar_container")
    .append("svg")
    .attr("viewBox", `0 0 ${bar_width + bar_margin.left + bar_margin.right} ${bar_height + bar_margin.top + bar_margin.bottom}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("width", "100%")
    .style("height", "auto");
  
  const barChart = svg.append("g")
    .attr("transform", `translate(${bar_margin.left},${bar_margin.top})`);
  
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

  d3.csv("data/demographics.csv").then(function(data) {
    // Process the data: count occurrences by PERP_RACE and sort them in descending order.
    const raceCounts = d3.rollup(data, v => v.length, d => d.PERP_RACE);
    const raceCountArray = Array.from(raceCounts.entries())
      .sort((a, b) => b[1] - a[1]);
  
      const x = d3.scaleLinear()
      .domain([0, d3.max(raceCountArray, d => d[1])])
      .range([5, bar_width]);
    
      const y = d3.scaleBand()
        .range([0, bar_height])
        .domain(raceCountArray.map(d => d[0]))
        .padding(0.1);

    // Create the bars.
    barChart.selectAll("rect")
      .data(raceCountArray)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", "#2171b5")
      .on("mouseenter", (event, d) => {
        barTip.transition().duration(200).style("opacity", 0.9);
        barTip.html(`
          <strong>Arrest as a Percentage:</strong> ${(d[1] / 186 * 100).toFixed(2)}%<br>
          <strong>Total Arrests:</strong> ${d[1]}<br>
        `)
          .style("top", (event.pageY - 28) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mousemove", (event) => {
        barTip.style("left", (event.pageX) + "px")
              .style("top", (event.pageY) + "px");
      })
      .on("mouseleave", () => {
        barTip.transition().duration(200).style("opacity", 0);
      });
  
    // Append the X axis.
    barChart.append("g")
      .attr("transform", `translate(0,${bar_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("font-size", "8px")
      .style("text-anchor", "end");
  
    // Append the Y axis.
    barChart.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end")
      .call(g => g.select(".domain").remove());
      
  
  
    barChart.selectAll("line.vertical-grid")
      .data(x.ticks())
      .enter()
      .append("line")
      .attr("class", "vertical-grid")
      .attr("x1", d => x(d))
      .attr("y1", 30)
      .attr("x2", d => x(d))
      .attr("y2", bar_height)
      .style("stroke", "gray")
      .style("stroke-width", 0.5)
      .style("stroke-dasharray", "2 2");
  
   
    barChart.append("text")
      .attr("x", (bar_width / 2))
      .attr("y", -10)
      .style("text-anchor", "middle")
      .style("fill", "darkslategray")
      .style("font-size", "14px")
      .html(`<a href="https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u/about_data">
              Arrest Rates for Prostitution by Race/Ethnicity in Queens (2021-2024)
             </a>`);
  
       
    barChart.append("text")
    .attr("x", bar_width / 2)
    .attr("y", bar_height + 40) 
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "darkslategray")
    .text("Source: NYPD NYC Open Data");

   
    barChart.append("text")
    .attr("x", bar_width / 2)
    .attr("y", bar_height +28) 
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "darkslategray")
    .text("By: David Paiz-Torres");
  });
}


renderBarChart();


window.addEventListener("resize", renderBarChart);
