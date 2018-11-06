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
      $(function() {
    $( "#linedialog" ).dialog({
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
  originalX=draggingNode.y;
  originalY=draggingNode.x;
  console.log(originalX)
  console.log(originalY)
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
  var first = false;
  draggedNode=d;
  var childcount =0;
  svg.selectAll('g.node')
    .filter(function(d, i) {
      if(distance(draggedNode.x,draggedNode.y, d.x, d.y) < 20 && draggedNode!=d){
                  //should check the cases in here
          if (draggedNode.parent==d.parent && d.depth==draggedNode.depth) //same level same branch
          {
            if (typeof draggedNode.children !='undefined')
              childcount = draggedNode.children.length
            
              if (childcount > 0) {//add children of dragged node to the children of d node
              
                for (j =0 ; j<childcount;j++){
                
                  addtochildren(d,draggedNode.children[0])
                }
                 
              }

               d.data.name= d.data.name+"&" + draggedNode.data.name; 
               d3.selectAll('.copys').remove();//remove copy of node
               //remove link of the node 
               removelink(draggedNode);
               updatealltext();
               removedraggedNode(draggedNode)
          
          }//check for case1
          else if (draggedNode.parent!=d.parent && d.depth==draggedNode.depth){//same level different branch
                              
                        $( "#dialog-1" ).dialog( "open" );
                         $("#firstbutton").click(function(){// create copy of nodes in each branch
                            //close dialog box first then
                              console.log(draggedNode.depth + "," + draggedNode.height)
                              $( "#dialog-1" ).dialog( "close" );
                               if (typeof draggedNode.children !='undefined')
                                 childcount = draggedNode.children.length
                               
                               if (childcount > 0) {//add children of dragged node to the children of d node
                                   for (j =0 ; j<childcount;j++){
                                     addtochildren(d,draggedNode.children[0])
                                   }
                                   var copysubtree=clonetree(d, draggedNode.depth, draggedNode.height);
                                   console.log("copysubtree")
                                   console.log(copysubtree)
                                   copysubtree.children.forEach(function(f){
                                   f.parent=draggedNode;
                                      if (typeof draggedNode.children !== 'undefined') {
                                           draggedNode.children.push(f);
                                       } else {
                                           draggedNode.children=[];
                                           draggedNode.data.children=[];
                                           draggedNode.children.push(f);
                                       }
                                       draggedNode.data.children.push(f.data);
                                   })
                                 }
                            



                             
                              draggedNode.data.name= d.data.name+"&" + draggedNode.data.name;

                             
                              d.data.name= draggedNode.data.name;
                           
                              
                              d3.selectAll('.copys').remove();
                              //removelink(draggedNode);
                              //removedraggedNode(draggedNode)
                              //console.log(root)
                             // transformNode(draggedNode,originalX,originalY);
                             // updatealltext();
                              deshadownode();
                             // console.log(root);
                              update(draggedNode);
                              updatealltext();
                              
                             
                         });
                        // console.log(d.data.name)
                        $("#secondbutton").click(function(){ //move the node to dropping point
                          
                          $( "#dialog-1" ).dialog( "close" );
                          
                            if (typeof draggedNode.children !='undefined')
                              childcount = draggedNode.children.length
                            
                            if (childcount > 0) {//add children of dragged node to the children of d node
                              
                                for (j =0 ; j<childcount;j++){
                                
                                  addtochildren(d,draggedNode.children[0])
                                }
                                 // console.log(f) 
                          }
                          d.data.name= d.data.name+"&" + draggedNode.data.name;
                          d3.selectAll('.copys').remove();
                          removelink(draggedNode);
                          updatealltext();
                          removedraggedNode(draggedNode) 
                        });
         }//secondcase
         else if (draggedNode.parent!=d.parent && d.depth!=draggedNode.depth &&draggedNode.parent!=d && d.parent!=draggedNode){//different level different branch
          
           
             $( "#dialog-2" ).dialog( "open" );
             $("#firstbutton2").click(function(){//merge without adding to children
                 $( "#dialog-2" ).dialog( "close" );
                   if (typeof draggedNode.children !='undefined')
                     childcount = draggedNode.children.length
                   
                     if (childcount > 0) {//add children of dragged node to the children of d node
                     
                       for (j =0 ; j<childcount;j++){
                       
                         addtochildren(d,draggedNode.children[0])
                       }
                        // console.log(f) 
                 }
                 d.data.name= d.data.name+"&" + draggedNode.data.name;
                 d3.selectAll('.copys').remove();
                 removelink(draggedNode);
                 updatealltext();
                 removedraggedNode(draggedNode)
             });
             $("#secondbutton2").click(function(){//add the dragged node to the children of the parent node
                 $( "#dialog-2" ).dialog( "close" );
                 
                 d3.selectAll('.copys').remove();

                // console.log(draggedNode.parent.children)
                addtochildren(d,draggedNode)
                deshadownode(draggedNode)
            
             });
     }//thirdcase
     else if (draggedNode.parent!=d.parent && d.depth!=draggedNode.depth &&draggedNode.parent==d ){//same branch different level
         if (typeof draggedNode.children !='undefined')
           childcount = draggedNode.children.length
         
         if (childcount > 0) {//add children of dragged node to the children of d node
           
             for (j =0 ; j<childcount;j++){
             
               addtochildren(d,draggedNode.children[0])
             }
       }
          d.data.name= d.data.name+"&" + draggedNode.data.name; 
          d3.selectAll('.copys').remove();//remove copy of node
          //remove link of the node 
          removelink(draggedNode);
          updatealltext();
          removedraggedNode(draggedNode)
    } //forthcase
    else if (draggedNode.parent!=d.parent && d.depth!=draggedNode.depth &&draggedNode==d.parent){
          if (typeof d.children !='undefined')
            childcount = d.children.length
          
          if (childcount > 0) {//add children of dragged node to the children of d node
            
              for (j =0 ; j<childcount;j++){
              
                addtochildren(draggedNode,d.children[0])
              }
          }else{
            transformNode(draggedNode,originalX,originalY)

          }
          draggedNode.data.name= d.data.name +"&" +draggedNode.data.name; 
          d3.selectAll('.copys').remove();
          removelink(d);
          updatealltext();
          removedraggedNode(d)
          deshadownode()
    } 
    return true
  }//check for distance
  /*else if(draggedNode!=d && distFromLine(draggedNode.x,draggedNode.y,d)<=30) {

        $( "#linedialog" ).dialog( "open" );
         $("#linebutton1").click(function(){


         })//linebutton1

         $("#linebutton2").click(function(){


         })
         console.log(d)
        
        return true
      }*/else{
        return false
      }

})
console.log(draggedNode.x)
console.log(draggedNode.y)


  d3.select(this).classed("active", false);
}
