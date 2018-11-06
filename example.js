 var data =
  {
    "name": "A",
    "children": [
      { 
    "name": "B",
        "children": [
          { "name": "C" },
          { "name": "D", 
              "children" : [
              {"name": "H",
                "children": [
                {"name": "J"}
                ]
            },
              {"name" : "L"}
              ]
        }
        ]
      },
      { 
        "name": "E" ,
        "children": [
          { "name": "f",
          "children": [
                {"name": "K"}
                ]
           },
          { "name": "g" }
        ]
      },{
        "name": "I"
      }
    ]
  };

// ### DATA MODEL END

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
	width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").
	append("svg").
  attr("width", width + margin.right + margin.left).
  attr("height", height + margin.top + margin.bottom).
  append("g").
  attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0, duration = 750, root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(data, function(d) {
	return d.children;
});
root.x0 = height / 2;
root.y0 = 0;

update(root);

//var selected = null;

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
  	links = treeData.descendants().slice(1);
    nodes.forEach(function(d){
      if (d.parent!=null){
    d.depth = d.parent.depth+1 
    d.height=d.parent.height-1;
  }
  });
  // Normalize for fixed-depth.
  nodes.forEach(function(d){
  	d.y = d.depth * 180
  });

  // ### LINKS

  // Update the links...
  var link = svg.selectAll('line.link').
  	data(links, function(d) {
    	return d.id;
    });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().
  	append('line').
    attr("class", "link").
    attr("stroke-width", 2).
    attr("stroke", 'black').
    attr('x1', function(d) {
    	return source.y0;
    }).
    attr('y1', function(d) {
    	return source.x0;
    }).
    attr('x2', function(d) {
    	return source.y0;
    }).
    attr('y2', function(d) {
    	return source.x0;
    })
    
  var linkUpdate = linkEnter.merge(link);
  
  linkUpdate.transition().
  	duration(duration).
    attr('x1', function(d) {
    	return d.parent.y;
    }).
    attr('y1', function(d) {
    	return d.parent.x;
    }).
    attr('x2', function(d) {
    	return d.y;
    }).
    attr('y2', function(d) {
    	return d.x;
    });

  // Transition back to the parent element position
  linkUpdate.transition().
  	duration(duration).
    attr('x1', function(d) {
    	return d.parent.y;
    }).
    attr('y1', function(d) {
    	return d.parent.x;
    }).
    attr('x2', function(d) {
    	return d.y;
    }).
    attr('y2', function(d) {
    	return d.x;
    });

  // Remove any exiting links
  var linkExit = link.exit().
  	transition().
    duration(duration).
    attr('x1', function(d) {
    	return source.x;
    }).
    attr('y1', function(d) {
    	return source.y;
    }).
    attr('x2', function(d) {
    	return source.x;
    }).
    attr('y2', function(d) {
    	return source.y;
    }).
    remove();

	// ### CIRCLES

  // Update the nodes...
  var node = svg.selectAll('g.node')
  	.data(nodes, function(d) {
    	return d.id || (d.id = ++i);
    });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().
    append('g').
    attr('class', 'node').
    attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    }).call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Add Circle for the nodes
  nodeEnter.append('circle').
  	attr('class', 'node').
    attr('r', 10).
    style("fill", function(d) {
    	return "#0e4677";
    });
    nodeEnter.append("text")
      .attr("dx", ".60em")
      .attr("x", function(d) { return d.children ? -30 : 30; })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.name; });
  // Update
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition().
  	duration(duration).
    attr("transform", function(d) {
    	return "translate(" + d.y + "," + d.x + ")";
  	});

  // Update the node attributes and style
  nodeUpdate.select('circle.node').
  	attr('r', 10).
    style("fill", function(d) {
    	return "#0e4677";
  	}).
    attr('cursor', 'pointer');

  // Remove any exiting nodes
  var nodeExit = node.exit().
  	transition().
    duration(duration).
    attr("transform", function(d) {
    	return "translate(" + source.y + "," + source.x + ")";
    }).
    remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle').attr('r', 0);
  
  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

 
  
}
$(function() {
    $( "#dialog-1" ).dialog({
       autoOpen: false,  
    });
    $
 });
   $(function() {
    $( "#dialog-2" ).dialog({
       autoOpen: false,  
    });
    $
 });
var originalX=null;
var originalY=null;
function dragstarted(d) {
  draggingNode = d;
  d3.select(this).raise().classed("active", true);
  copynode=d3.select("g").append("circle").attr("class", "copys")
                    .attr('r', 10)
                    .style("fill", function(d) {
                          return "#0e4677";
                        })
                    .style("stroke","steelblue")
                    .style("stroke-width","3px")
                    .attr("cx",draggingNode.y)
                    .attr("cy",draggingNode.x)
      originalX=draggingNode.x;
      originalY=draggingNode.y;
       //creating shadowi image of dragging node
  d3.select(this).append("circle")
    .attr('r', 10).style("fill","lightblue")  
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
  draggedNode=d;
  svg.selectAll('g.node')
    .filter(function(d, i) {
      if(draggedNode!=d && distFromLine(draggedNode.x,draggedNode.y,d)<=30) {
        
      	return true
      }else{
      	return false
      }
	})
     d3.select(this).classed("active", false);
}