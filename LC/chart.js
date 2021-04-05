async function drawLineChart() {
  //Data
  let dataset = await d3.json("../my_weather_data.json");
  //console.table(dataset);

  const yAccessor = (d) => d.temperatureMax;
  //console.log(yAccessor(dataset[0]));

  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);
  //console.log(xAccessor(dataset[0]));

  //Chart dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 500,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //Draw Canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );

  //Scales
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  //Draw data
  const lineGenerator = d3
    .line()
    .curve(d3.curveStep)
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("class", "line");

  //Periphericals
  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(3);
  const yAxis = bounds.append("g").attr("class", "y-axis").call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("class", "y-axis-label")
    .html("Maximun Temperature");

  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .attr("class", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .call(xAxisGenerator);
}
drawLineChart();
