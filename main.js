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
var draggingNode=null;
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

var originalX=null;
var originalY=null;

//var permchanges=[];

//var rootdouble;
//permchanges.push(rootdouble)
/*$(function() {
 $("#undobutton").click(function(){
  if (permchanges.length<=1){
     $(this).prop("disabled",true);
     
  }else{
    $(this).prop("disabled",false);
    console.log(permchanges.length)
      permchanges.pop()
     // console.log(permchanges.length)
     // console.log(permchanges[permchanges.length-1])
      root=clonetree(permchanges[permchanges.length-1],permchanges[permchanges.length-1].depth,permchanges[permchanges.length-1].height);
      root.x0 = height / 2;
      root.y0 = 0;
      //console.log(root)
      update(root,svg,root) 
      updatealltext();

  }          
})
})*/
var clicked= false;
function dragstarted(d) {
   clicked = false;
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
 var childcount=0;
// console.log("kuft zahremar")
 //console.log(svg.selectAll('g.node'))
 var newnodes=root.descendants();
 console.log("newnodes")
 console.log(newnodes)
  svg.selectAll('g.node')
    .filter(function(d, i) {
      if(distance(draggingNode.x,draggingNode.y, d.x, d.y) < 20 && draggingNode!=d){
         console.log("that d where it thinks it is near it stupid")
         console.log(d)
        touchedNode=true;
        if (d.depth==draggingNode.depth) //same level different branch or same branch
          {
            d3.select("body").select("#dialogbox1").style("display", "block")
            $("#duplicatenodes").click(function(){// create copy of nodes in each branch
                  clicked=true;
                  duration=500;
                  duplicatebranches(draggingNode,d,root)
                  d3.selectAll('.copys').remove();
                  update(root,svg,root)
                  updatealltext();
                  console.log("draggingNode after duplicating")
                  console.log(draggingNode)
               //   permchanges.push(clonetree(root,root.depth,root.height))
                  d3.select("body").select("div.dialogbox").style("display", "none")

            });
           // var firstover=false;
         /*   $("#duplicatenodes").mouseenter(function(){
              duration=0;
             // if (!firstover){
               // console.log(draggingNode.id)
                rootC=clonetree(root,root.depth,root.height)
               // console.log(rootC)
                var draggingNodeC=findNode(rootC,draggingNode);
              //  console.log(draggingNodeC)
                var dC=findNode(rootC,d)
              //  console.log(dC)

              duplicatebranches(draggingNodeC,dC,rootC)
           // duplicatebranches(draggingNode,d)

              update(draggingNodeC,svg,rootC)
          //    console.log("heyooheyooooooooooooooo rootC got x or not")
            //  console.log(rootC)
              //newOpacity=0.6;
              //svg.selectAll("*").style("opacity", newOpacity);
              updatealltext();
             
            //}

            })
                         
            $("#duplicatenodes").mouseleave(function(){
              if(!clicked){
                svg.selectAll("*").remove();
                duration=0;
                update(root,svg,root)
              }
              
              
            })*/
            $("#mergenodes").mouseenter(function(){
              rootC=clonetree(root,root.depth,root.height)
               //  console.log(rootC)
                  var draggingNodeC=findNode(rootC,draggingNode);
                 // console.log(draggingNodeC)
                  var dC=findNode(rootC,d)
                //  console.log(dC)

                 if (typeof draggingNodeC.children !='undefined'){
                   
                    childcount = draggingNodeC.children.length
                 }
                  
                  if (childcount > 0) {//add children of dragged node to the children of d node
                    
                      for (j =0 ; j<childcount;j++){
                      
                        addtochildren(dC,draggingNodeC.children[0])
                      }
                    
                  }
                  //
                
                dC.data.name= dC.data.name+"&" + draggingNodeC.data.name;
                update(dC,svg,rootC)
                updatealltext()
                
               // d3.selectAll('.copys').remove();

                removelink(draggingNodeC);
                
                removedraggedNode(draggingNodeC)
                
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
              console.log("draggingNode in clicking on merge node")
              console.log(draggingNode)
               if (typeof draggingNode.children !='undefined'){
                   
                    childcount = draggingNode.children.length
                 }
                  
                  if (childcount > 0) {//add children of dragged node to the children of d node
                    
                      for (j =0 ; j<childcount;j++){
                      
                        addtochildren(d,draggingNode.children[0])
                      }
                    
                  }
                  //
                d.data.name= d.data.name+"&" + draggingNode.data.name;
                
                
                d3.selectAll('.copys').remove();
                removelink(draggingNode);
                removedraggedNode(draggingNode) 
                update(d,svg,root)
                updatealltext()
              //  permchanges.push(clonetree(root,root.depth,root.height))
                A = d3.select("body").select("div.dialogbox")
                //console.log(A)
                A.style("display", "none")
                
              });

          }else if (draggingNode.parent!=d.parent && d.depth!=draggingNode.depth){//all other cases
            d3.select("body").select("#dialogbox2").style("display", "block")
            $("#mergenodes2").click(function(){
              clicked=true;
              if (draggingNode.parent!=d && d.parent!=draggingNode){//different level different branch    
                  mergeNodes(draggingNode,d,root) 
                       
               //   permchanges.push(clonetree(root,root.depth,root.height))      
                        
              }else if(draggingNode.parent==d){
                  mergeNodes(draggingNode,d,root) 
              //     permchanges.push(clonetree(root,root.depth,root.height))
              }else if (draggingNode==d.parent){
                if (typeof d.children !='undefined')
                  childcount = d.children.length
                
                if (childcount > 0) {//add children of dragged node to the children of d node
                  
                    for (j =0 ; j<childcount;j++){
                    
                      addtochildren(draggingNode,d.children[0])
                    }
                }else{
                  transformNode(draggingNode,originalX,originalY)

                }
               
                draggingNode.data.name= d.data.name +"&"+draggingNode.data.name; 
                d3.selectAll('.copys').remove();
                removelink(d);
                updatealltext();
                removedraggedNode(d)
                deshadownode()
                update(root,svg,root)
               // permchanges.push(clonetree(root,root.depth,root.height))
              
              }
              
              d3.select("body").selectAll("div.dialogbox").style("display", "none")
            });
            $("#mergenodes2").mouseenter(function(){
              duration=500;
              if (draggingNode.parent!=d && d.parent!=draggingNode){
                rootC=clonetree(root,root.depth,root.height)
               //  console.log(rootC)
               // console.log(draggingNode)
                  var draggingNodeC=findNode(rootC,draggingNode);
                ///  console.log(draggingNodeC)
                  var dC=findNode(rootC,d)
                //  console.log(dC)
                  mergeNodes(draggingNodeC,dC,rootC) 

              }else if(draggingNode.parent==d){
                rootC=clonetree(root,root.depth,root.height)
                 //console.log(rootC)
                  var draggingNodeC=findNode(rootC,draggingNode);
                  //console.log(draggingNodeC)
                  var dC=findNode(rootC,d)
                 // console.log(dC)
                  mergeNodes(draggingNodeC,dC,rootC)

              }else if (draggingNode==d.parent){
                rootC=clonetree(root,root.depth,root.height)
                 console.log(rootC)
                var draggingNodeC=findNode(rootC,draggingNode);
                  console.log(draggingNodeC)
                  var dC=findNode(rootC,d)
                  console.log(dC)
                 if (typeof dC.children !='undefined')
                   childcount = dC.children.length
                 
                 if (childcount > 0) {//add children of dragged node to the children of d node
                   
                     for (j =0 ; j<childcount;j++){
                     
                       addtochildren(draggingNodeC,dC.children[0])
                     }
                 }else{
                   transformNode(draggingNodeC,originalX,originalY)

                 }
                 draggingNodeC.data.name= dC.data.name +"&"+draggingNodeC.data.name; 
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
  if (draggingNode.id!=d.id && isNearLine(draggingNode.x,draggingNode.y,d)){
    if (!touchedNode){
      d3.select("body").select("#dialogbox3").style("display", "block")
      $("#addtomiddle").click(function(){
        clicked=true;
      addtochildren(d.parent,draggingNode)
      addtochildren(draggingNode,d)
      deshadownode()
       d3.selectAll('.copys').remove();
       update(root,svg,root)
      // permchanges.push(clonetree(root,root.depth,root.height))
       d3.select("body").selectAll("div.dialogbox").style("display", "none")
     })
     $("#addtochildren").click(function(){
      clicked=true;
        addtochildren(d.parent,draggingNode)
        deshadownode()
        d3.selectAll('.copys').remove();
        update(root,svg,root)
       // permchanges.push(clonetree(root,root.depth,root.height))
        d3.select("body").selectAll("div.dialogbox").style("display", "none")
     })
     $("#addtomiddle").mouseenter(function(){

        rootC=clonetree(root,root.depth,root.height)
        console.log(rootC)
        var draggingNodeC=findNode(rootC,draggingNode);
        console.log(draggingNodeC)
        var dC=findNode(rootC,d)
         addtochildren(dC.parent,draggingNodeC)
         addtochildren(draggingNodeC,dC)
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
        var draggingNodeC=findNode(rootC,draggingNode);
        console.log(draggingNodeC)
        var dC=findNode(rootC,d)
        addtochildren(dC.parent,draggingNodeC)
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