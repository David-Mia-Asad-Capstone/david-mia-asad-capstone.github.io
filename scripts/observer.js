const line_observe = document.querySelector("#container");
let hasAnimated = false;
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            lineChart.selectAll("path")
                .attr('stroke-dasharray', function() {
                    const length = this.getTotalLength();
                    return length + ' ' + length;
                })
                .style("pointer-events", "stroke")
                .attr('stroke-dashoffset', function() {
                    const length = this.getTotalLength();
                    return length;
                })
                .transition()
                .duration(12000)
                .attr('stroke-dashoffset', 0)
                .on("end", () => {
                    isAnimating = true;
                });
            lineChart.selectAll("circle")
                .style("opacity", 0)
                .transition()
                .duration(3000)
                .delay((d, i) => i * 500)
                .style("opacity", 1);
            hasAnimated = true;
        }
    });
});
observer.observe(line_observe);