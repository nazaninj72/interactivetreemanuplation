var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 960,
    barHeight = 20,
    barWidth = (width - margin.left - margin.right) * 0.8;

var i = 0,
    duration = 400,
    root;

var diagonal = d3.linkHorizontal()
    .x(function(d) { return d.y; })
    .y(function(d) { return d.x; });

var svg = d3.select("#tree_container").append("svg")
    .attr("width", width) // + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("flare.json", function(error, flare) {
  if (error) throw error;
  root = d3.hierarchy(flare);
  root.x0 = 0;
  root.y0 = 0;
  update(root);
 console.log(root)
});
 
function update(source) {

  // Compute the flattened node list.
  var nodes = root.descendants();

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
  var index = -1;
  root.eachBefore(function(n) {
    n.x = ++index * barHeight;
    n.y = n.depth * 20;
  });

  // Update the nodes…
  var node = svg.selectAll(".node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .style("opacity", 0);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
    .attr('class', 'node')
    .attr("id", function(d){return d.data.name+d.id})
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", "#3182bd")
      

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.data.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", "#3182bd")

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 0)
      .remove();

  // Update the links…
  var link = svg.selectAll(".link")
    .data(root.links(), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  root.each(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
/*function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}*/
/*function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}*/
function clone(selector) {
    var node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true),
node.nextSibling));
}


function dragstarted(d) {
   clicked = false;
  draggingNode = d;
  var copy = clone(this).attr("class", "copys");
  console.log(copy)

 /*var copynode =d3.select("g")
    .data(draggingNode)
   .enter().append("g")
      .attr("class", "copys")
      .attr("transform", function(d) { return "translate(" + draggingNode.y0 + "," + draggingNode.x0 + ")"; })
 console.log(d3.selectAll('.copys'))
 copynode.append("rect")
     .attr("y",-barHeight / 2)
      .attr("height", barHeight)
      .style("fill", "#3182bd")
      .style("opacity",0.5)
      .attr("width", barWidth)

 copynode.append("text")
     .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text( draggingNode.data.name); */ 
  d3.select(this).style("opacity",0.4)
  d3.select(this).raise().classed("active", true);
       //creating shadowi image of dragging node
// console.log(draggingNode.data.name)
  dragStarted = null;
}

function dragged(d) {
  //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  //draggingNode=d;

  d.y += d3.event.dx
  d.x += d3.event.dy
  d3.select(this).attr("transform", "translate(" + d.y + "," + d.x + ")");
}
function dragended(d) {
  var touchedNode=false;
  var first=false;
 var childcount=0;
 draggingNode=d;
 svg.selectAll('g.node')
    .filter(function(d, i) {
      if(distance(draggingNode.x,draggingNode.y, d.x, d.y) < 20 && draggingNode!=d){
        alert("here we are again")
        console.log(d)
        return true

      }else{
        return false
      }
    })
  d3.select(this).classed("active", false);
  
}


function windowClose(){
  d3.select("body").selectAll("div.dialogbox").style("display", "none")
}