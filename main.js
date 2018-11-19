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
var margin = {top: 20, right: 90, bottom: 30, left: 90},
width = 1060 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
var svg = d3.select("#tree_container").
append("svg").
attr("width", width + margin.right + margin.left).
attr("height", height + margin.top + margin.bottom).
append("g").
attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var i = 0, duration = 500, root;
var treemap = d3.tree().size([height, width]);
root = d3.hierarchy(data, function(d) {
  return d.children;
});
root.x0 = height / 2;
root.y0 = 0;
update(root,svg,root);
function update(source,svg,root) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);
  //console.log(treeData)
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
    node = svg.selectAll('g.node')
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

function clonetree(root, depth, height){

  var cloneroot=clonenode(root, typeof root.children=='undefined', depth, height)
 

  if (typeof root.children!='undefined'){
   // console.log("entered here")
 
    root.children.forEach(function(f){
      var newNode=clonetree(f, depth + 1, height - 1)
     //console.log("newnode")
     //console.log(newNode)
      cloneroot.children.push(newNode)
      cloneroot.data.children.push(newNode.data)
      newNode.parent=cloneroot;
    })
      
     
     // console.log("newnode after adding children")
     // console.log(newNode)
    
    //j=0;
    return cloneroot;
  }else{
   // console.log(cloneroot)
  // j=0;
    return cloneroot;

  }
} 
function clonenode(node, isleaf, depth, height){
  var newNode = {
     
      name: node.data.name,
      
    };

    //Creates a Node from newNode object using d3.hierarchy(.)
    var newNode = d3.hierarchy(newNode);
    newNode.depth = depth
    newNode.height = height
    newNode.id=node.id
    //newNode.height = root.height - 1
    if(!isleaf){
      newNode.children=[];
      newNode.data.children=[];
    }
   
    return newNode;
}
var originalX=null;
var originalY=null;

var permchanges=[];

var rootdouble;
rootdouble=clonetree(root, root.depth, root.height)
permchanges.push(rootdouble)
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

       //creating shadowi image of dragging node
  d3.select(this).append("circle")
    .attr('r', 10).attr("opacity", 0.9).style("fill","#b0c4de")  
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
 var draggedNode=d;
 var childcount=0;
 var clicked = false;
 var active=false;
  svg.selectAll('g.node')
    .filter(function(d, i) {
      if(distance(draggedNode.x,draggedNode.y, d.x, d.y) < 20 && draggedNode!=d){
        touchedNode=true;
        if (d.depth==draggedNode.depth) //same level different branch or same branch
          {
            d3.select("body").select("#dialogbox1").style("display", "block")
            $("#duplicatenodes").click(function(){// create copy of nodes in each branch
                  clicked=true;
                  duplicatebranches(draggedNode,d,root)
                  update(draggedNode,svg,root)
                  permchanges.push(clonetree(root,root.depth,root.height))
                  d3.select("body").select("div.dialogbox").style("display", "none")

            });
           // var firstover=false;
            $("#duplicatenodes").mouseenter(function(){
              duration=500;
             // if (!firstover){
               // console.log(draggedNode.id)
                rootC=clonetree(root,root.depth,root.height)
               // console.log(rootC)
                var draggedNodeC=findNode(rootC,draggedNode);
              //  console.log(draggedNodeC)
                var dC=findNode(rootC,d)
              //  console.log(dC)

              duplicatebranches(draggedNodeC,dC,rootC)
           // duplicatebranches(draggedNode,d)

              update(draggedNodeC,svg,rootC)
              //newOpacity=0.6;
              //svg.selectAll("*").style("opacity", newOpacity);
              updatealltext();
              duplicatenodes.active = active;
            //}

            })
                         
            $("#duplicatenodes").mouseleave(function(){
              if(!clicked){
                svg.selectAll("*").remove();
                duration=0;
                update(root,svg,root)
              }
              
              
            })
            $("#mergenodes").mouseenter(function(){
              rootC=clonetree(root,root.depth,root.height)
               //  console.log(rootC)
                  var draggedNodeC=findNode(rootC,draggedNode);
                  console.log(draggedNodeC)
                  var dC=findNode(rootC,d)
                  console.log(dC)

                 if (typeof draggedNodeC.children !='undefined'){
                   
                    childcount = draggedNodeC.children.length
                 }
                  
                  if (childcount > 0) {//add children of dragged node to the children of d node
                    
                      for (j =0 ; j<childcount;j++){
                      
                        addtochildren(dC,draggedNodeC.children[0])
                      }
                    
                  }
                  //
                  
                dC.data.name= dC.data.name+"&" + draggedNodeC.data.name;
                update(dC,svg,rootC)
                updatealltext()
                
                d3.selectAll('.copys').remove();

                removelink(draggedNodeC);
                
                removedraggedNode(draggedNodeC)
                
              })
              $("#mergenodes").mouseleave(function(){
               if(!clicked){
                svg.selectAll("*").remove();
                duration=0;
                update(root,svg,root)
               }
                
               
              })
             
             $("#mergenodes").click(function(){
              clicked=true;

               if (typeof draggedNode.children !='undefined'){
                   
                    childcount = draggedNode.children.length
                 }
                  
                  if (childcount > 0) {//add children of dragged node to the children of d node
                    
                      for (j =0 ; j<childcount;j++){
                      
                        addtochildren(d,draggedNode.children[0])
                      }
                    
                  }
                  //
                d.data.name= d.data.name+"&" + draggedNode.data.name;
                update(d,svg,root)
                updatealltext()
                
                d3.selectAll('.copys').remove();
                removelink(draggedNode);
                removedraggedNode(draggedNode) 
                permchanges.push(clonetree(root,root.depth,root.height))
                A = d3.select("body").select("div.dialogbox")
                console.log(A)
                A.style("display", "none")
                
              });

          }else if (draggedNode.parent!=d.parent && d.depth!=draggedNode.depth){//all other cases
            d3.select("body").select("#dialogbox2").style("display", "block")
            $("#mergenodes2").click(function(){
              clicked=true;
              if (draggedNode.parent!=d && d.parent!=draggedNode){//different level different branch    
                            
                  mergeNodes(draggedNode,d,root)                          
                  permchanges.push(clonetree(root,root.depth,root.height))      
                        
              }else if(draggedNode.parent==d){
                  mergeNodes(draggedNode,d,root) 
                   permchanges.push(clonetree(root,root.depth,root.height))
              }else if (draggedNode==d.parent){
                if (typeof d.children !='undefined')
                  childcount = d.children.length
                
                if (childcount > 0) {//add children of dragged node to the children of d node
                  
                    for (j =0 ; j<childcount;j++){
                    
                      addtochildren(draggedNode,d.children[0])
                    }
                }else{
                  transformNode(draggedNode,originalX,originalY)

                }
               
                draggedNode.data.name= d.data.name +"&"+draggedNode.data.name; 
                d3.selectAll('.copys').remove();
                removelink(d);
                updatealltext();
                removedraggedNode(d)
                deshadownode()
                update(root,svg,root)
                permchanges.push(clonetree(root,root.depth,root.height))
              
              }
              
              d3.select("body").selectAll("div.dialogbox").style("display", "none")
            });
            $("#mergenodes2").mouseenter(function(){
              duration=500;
              if (draggedNode.parent!=d && d.parent!=draggedNode){
                rootC=clonetree(root,root.depth,root.height)
                // console.log(rootC)
                  var draggedNodeC=findNode(rootC,draggedNode);
                //  console.log(draggedNodeC)
                  var dC=findNode(rootC,d)
                //  console.log(dC)
                  mergeNodes(draggedNodeC,dC,rootC) 

              }else if(draggedNode.parent==d){
                rootC=clonetree(root,root.depth,root.height)
                 //console.log(rootC)
                  var draggedNodeC=findNode(rootC,draggedNode);
                  //console.log(draggedNodeC)
                  var dC=findNode(rootC,d)
                 // console.log(dC)
                  mergeNodes(draggedNodeC,dC,rootC)

              }else if (draggedNode==d.parent){
                rootC=clonetree(root,root.depth,root.height)
                 console.log(rootC)
                var draggedNodeC=findNode(rootC,draggedNode);
                  console.log(draggedNodeC)
                  var dC=findNode(rootC,d)
                  console.log(dC)
                 if (typeof dC.children !='undefined')
                   childcount = dC.children.length
                 
                 if (childcount > 0) {//add children of dragged node to the children of d node
                   
                     for (j =0 ; j<childcount;j++){
                     
                       addtochildren(draggedNodeC,dC.children[0])
                     }
                 }else{
                   transformNode(draggedNodeC,originalX,originalY)

                 }
                 draggedNodeC.data.name= dC.data.name +"&"+draggedNodeC.data.name; 
                 update(rootC,svg,rootC)
                 updatealltext();
                 d3.selectAll('.copys').remove();
                 removelink(dC);
                 removedraggedNode(dC)
                 deshadownode()
                 update(rootC,svg,rootC)
                  

              }
            })
            $("#mergenodes2").mouseleave(function(){
              if (!clicked){
                svg.selectAll("*").remove();
                duration=0;
                update(root,svg,root)
              }
            })
             
          }
        return true//distance check
        }else{
          return false
        }//end of distance check
       })
svg.selectAll('line.link').filter(function(d,i){
  if (draggedNode!=d && isNearLine(draggedNode.x,draggedNode.y,d)){
    if (!touchedNode){
      d3.select("body").select("#dialogbox3").style("display", "block")
      $("#addtomiddle").click(function(){
        clicked=true;
      addtochildren(d.parent,draggedNode)
      addtochildren(draggedNode,d)
      deshadownode()
       d3.selectAll('.copys').remove();
       update(root,svg,root)
       permchanges.push(clonetree(root,root.depth,root.height))
       d3.select("body").selectAll("div.dialogbox").style("display", "none")
     })
     $("#addtochildren").click(function(){
      clicked=true;
        addtochildren(d.parent,draggedNode)
        deshadownode()
        d3.selectAll('.copys').remove();
        update(root,svg,root)
        permchanges.push(clonetree(root,root.depth,root.height))
        d3.select("body").selectAll("div.dialogbox").style("display", "none")
     })
     $("#addtomiddle").mouseenter(function(){

        rootC=clonetree(root,root.depth,root.height)
        console.log(rootC)
        var draggedNodeC=findNode(rootC,draggedNode);
        console.log(draggedNodeC)
        var dC=findNode(rootC,d)
         addtochildren(dC.parent,draggedNodeC)
         addtochildren(draggedNodeC,dC)
         deshadownode()
         d3.selectAll('.copys').remove();
         update(rootC,svg,rootC)
     })
     $("#addtomiddle").mouseleave(function(){
        if (!clicked){
          svg.selectAll("*").remove();
          duration=0;
          update(root,svg,root)
        }
     })
     $("#addtochildren").mouseenter(function(){
        rootC=clonetree(root,root.depth,root.height)
        console.log(rootC)
        var draggedNodeC=findNode(rootC,draggedNode);
        console.log(draggedNodeC)
        var dC=findNode(rootC,d)
        addtochildren(dC.parent,draggedNodeC)
        deshadownode()
        d3.selectAll('.copys').remove();
        update(rootC,svg,rootC)
     })
     $("#addtochildren").mouseleave(function(){
        if (!clicked){
          svg.selectAll("*").remove();
          duration=0;
          update(root,svg,root)
        }
     })

    }
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