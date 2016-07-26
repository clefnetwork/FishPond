//set up an array of RGB colors 
// use fill gradient attr on each
//at creation, set up color properties of the feesh


var w = 1000,
    h = 1000,
    //number of fish on screen
    n = 5,
    //m changes the tail length
    m = 8,
    degrees = 180 / Math.PI;

var fish = d3.range(n).map(function() {
  //setting the boundaries for fish
  var x = Math.random() * w, y = Math.random() * h;
  
  
  return {
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    path: d3.range(m).map(function() { return [x, y]; }),
    count: 0
  };
});

var svg = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h);


//Add Ripples here///////////////////////////////////////////////////////////////////////////////////////
svg.append("rect")
    .attr("width", w)
    .attr("height", h)
    .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);
/////////////////////////////////////////////////////////////////////////////////////////////////////////


var g = svg.selectAll("g")
    .data(fish)
  .enter().append("svg:g");
  



var head = g.append("svg:ellipse")
    .attr("rx", 6.5)
    .attr("ry", 4);


g.append("svg:path")
    .map(function(d) { return d.path.slice(0, 3); })
    .attr("class", "mid");
    


g.append("svg:path")
    .map(function(d) { return d.path; })
    .attr("class", "tail");
    


var tail = g.selectAll("path");

g.on("mouseover", function(){
    d3.select(this)
      .classed("hovered", true);
  })
.on("mouseout", function(){
    d3.select(this)
    .classed("hovered", false);
  });



d3.timer(function() {
  for (var i = -1; ++i < n;) {
    var fishSingle = fish[i],
        path = fishSingle.path,
        dx = fishSingle.vx,
        dy = fishSingle.vy,
        x = path[0][0] += dx,
        y = path[0][1] += dy,
        speed = Math.sqrt(dx * dx + dy * dy),
        count = speed * 2,
        k1 = -5 - speed / 3;

    // Bounce off the walls.
    if (x < 0 || x > w) fishSingle.vx *= -1;
    if (y < 0 || y > h) fishSingle.vy *= -1;

    // Swim!
    for (var j = 0; ++j < m;) {
      var vx = x - path[j][0],
          vy = y - path[j][1],
          //NOTE: Changed '600' to a lower amount speeds the tail speed
          k2 = Math.sin(((fishSingle.count += count) + j * 3) / 80) / speed;
      path[j][0] = (x += dx / speed * k1) - dy * k2;
      path[j][1] = (y += dy / speed * k1) + dx * k2;
      speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
    }
  }

  head.attr("transform", function(d) {
    return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
  });

  tail.attr("d", function(d) {
    return "M" + d.join("L");
  });
});


//Circle Ripples
function particle() {
  var m = d3.mouse(this);

  svg.insert("circle", "rect")
      .attr("cx", m[0])
      .attr("cy", m[1])
      .attr("r", 5) 
      .style("stroke", d3.hsl(199, 88, .5))
      .style("stroke-opacity", 1)
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("r", 75)
      .style("stroke-opacity", 1e-6)
      .style("stroke-width", 1)
      .remove();

  d3.event.preventDefault();
}
