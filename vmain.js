var margin = {top: 20, right: 90, bottom: 30, left: 90},
width = 1060 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;
var svg = d3.select("#tree_container").
append("svg").
attr("width", width + margin.right + margin.left).
attr("height", height + margin.top + margin.bottom).call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform)
      }))
     .append('g').attr("transform","translate(" + width / 2 + "," + 0 + ")")
.append('g');
var i = 0, duration = 500, root;
var panSpeed = 200;
var panBoundary = 20;
var chosenlayout="horizontal"//default is horizontal

treeJSON = d3.json("flare.json", function(error, data) {  

var treemap = d3.tree()
  .size([10*height, 2*width])
  .separation(function separation(a, b) { return a.parent == b.parent ? 4 : 1; });
root = d3.hierarchy(data, function(d) {
  return d.children;
});
root.y0 = height / 2;
root.x0 = 0;
var draggingNode=null;
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
     // Update the nodes...
    node = svg.selectAll('g.node')
     .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().
    append('line').
    attr("class", "link").
    attr("id", function(d){return d.data.name+d.id+"link"}).
    attr("stroke-width", 2).
    attr("stroke", 'black').
    attr('x1', function(d) {
      return source.x0;
    }).
    attr('y1', function(d) {
      return source.y0;
    }).
    attr('x2', function(d) {
      return source.x0;
    }).
    attr('y2', function(d) {
      return source.y0;
    })
    
  var linkUpdate = linkEnter.merge(link);
  
  linkUpdate.transition().
    duration(duration).
    attr('x1', function(d) {
      return d.parent.x;
    }).
    attr('y1', function(d) {
      return d.parent.y;
    }).
    attr('x2', function(d) {
      return d.x;
    }).
    attr('y2', function(d) {
      return d.y;
    });

  // Remove any exiting links
  /*var linkExit = link.exit().
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
    remove();*/

  // ### CIRCLES

 
  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().
    append('g').
    attr('class', 'node')
    .attr("transform", function(d) {
      return "translate(" + source.x0 + "," + source.y0 + ")";
    }).call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Add Circle for the nodes
  nodeEnter.append('circle').
    attr('class', 'node')
    .attr("id", function(d){return d.data.name+d.id})
    .attr('r', 10)
    .attr("opacity", 1.0)
    .style("fill", function(d) {
      return "#0e4677";
    });
    nodeEnter.append("text")
      .attr("dy", ".60em")
      .attr("y", function(d) { return d.children ? -30 : 30; })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.name; });
  // Update
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition().
    duration(duration).
    attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
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
    attr("transform", function(d) {
      return "translate(" + source.x + "," + source.y + ")";
    }).
    remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle').attr('r', 0);
  
  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.y0 = d.y;
    d.x0 = d.x;
  }); 
}
var clicked= false;
function selectSubtree(node,duration)
{
	if(typeof node.children!='undefined')
  {
  	node.children.forEach(function(d)
    {
    	d3.select("#" + d.data.name+d.id).transition().duration(duration).style("fill", "red");
		selectSubtree(d);
    });
  }
}
function dragstarted(d) {
   clicked = false;
  draggingNode = d;
 // console.log(draggingNode)
  var copy = clone(this).attr("class", "copys").attr("id",draggingNode.data.name+draggingNode.id);
  d3.selectAll('.copys').select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");
  d3.select(this).style("opacity",0.4)  
  //selectSubtree(draggingNode,0);
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  //draggingNode=d;
 // if (chosenlayout=="horizontal"){
    d.x += d3.event.dx
    d.y += d3.event.dy
    d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
  //}else if (chosenlayout=="vertical"){
  //  d.y += d3.event.dy
   // d.x += d3.event.dx
  //  d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
 // }
  
}
function dragended(d) {
  var touchedNode=false;
  var first=false;
 var childcount=0;
 draggingNode=d;
 var draggingNodeC;
 var dC;
 var draggedChildrenbefore=[];
 var dChildrenbefore=[];
 //console.log(root)
 svg.selectAll('g.node')
    .filter(function(d, i) {
      if(distance(draggingNode.x,draggingNode.y, d.x, d.y) < 20 && draggingNode!=d){
        touchedNode=true;
        d3.select("#" + d.data.name+d.id).style("fill", "red");
        if (d.depth==draggingNode.depth) //same level different branch or same branch
        {
          d3.select("body").select("#dialogbox1").style("display", "block")
          $("#duplicatenodes").off("click")
          $("#duplicatenodes").click(function(){
             clicked=true;
             duration=0;
             duplicatebranches(draggingNode,d,root)
             updateids(root)
             updatealltext();
             d3.selectAll('.copys').remove();
             
             update(root,svg,root)
             
             svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNode.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);
             d3.select("body").select("div.dialogbox").style("display", "none")
              
          })

          $("#duplicatenodes").off("mouseenter")
          $("#duplicatenodes").mouseenter(function(){
              duration=1000;
              rootC=clonetree(root,root.depth,root.height)
              draggingNodeC=findNode(rootC,draggingNode);
              dC=findNode(rootC,d)
             // draggedChildrenbefore=draggingNodeC.descendants()
              duplicatebranches(draggingNodeC,dC,rootC)
              updateids(rootC)
              d3.selectAll('.copys').remove();
              update(rootC,svg,rootC)
              updatealltext();
              selectSubtree(dC,1000)
              selectSubtree(draggingNodeC,1000)
              d3.select("#" + dC.data.name+dC.id).style("fill", "red");
              d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red"); 
              svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNodeC.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);
            //}

            })
          $("#duplicatenodes").off("mouseleave")
          $("#duplicatenodes").mouseleave(function(){
            if(!clicked){
           // console.log(draggedChildrenbefore)
            // removeTempChanges(draggingNodeC,dC,draggedChildrenbefore,dChildrenbefore,svg)
              svg.selectAll("*").remove();
              duration=0;
              inpreview=true;
              update(root,svg,root)
              d3.select("#" + d.data.name+d.id).style("fill", "red");
              d3.select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");
            }  
          })
          $("#mergenodes").off("mouseenter")
          $("#mergenodes").mouseenter(function(){
            duration=1000;
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
          d3.selectAll('.copys').remove();
          dC.data.name= dC.data.name+"AND" + draggingNodeC.data.name;
          inpreview=false;
          update(dC,svg,rootC)
          updatealltext()
          d3.select("#" + dC.data.name+dC.id).style("fill", "red");
          d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
          selectSubtree(dC,1000)
          removelink(draggingNodeC);           
          removedraggedNode(draggingNodeC)
              
        })
           $("#mergenodes").off("mouseleave")
          $("#mergenodes").mouseleave(function(){
           if(!clicked){
            svg.selectAll("*").remove();
            duration=0;
            inpreview=true;
            update(root,svg,root)
            d3.select("#" + d.data.name+d.id).style("fill", "red");
            d3.select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");
           }
          })
          $("#mergenodes").off("click")
          $("#mergenodes").click(function(){
           clicked=true;
           duration=1000;

            if (typeof draggingNode.children !='undefined'){
                
                 childcount = draggingNode.children.length
              }
               
               if (childcount > 0) {//add children of dragged node to the children of d node
                 
                   for (j =0 ; j<childcount;j++){
                   
                     addtochildren(d,draggingNode.children[0])
                   }
                 
               }
               //
             d.data.name= d.data.name+"AND" + draggingNode.data.name;
             
             
             d3.selectAll('.copys').remove();
             removelink(draggingNode);
             removedraggedNode(draggingNode) 
             update(d,svg,root)
             updatealltext()
             //permchanges.push(clonetree(root,root.depth,root.height))
             A = d3.select("body").select("div.dialogbox")
             //console.log(A)
             A.style("display", "none")
              console.log("root")
              console.log(root)
           })

        }//if (d.depth==draggednode.depth)
        else if (draggingNode.parent!=d.parent && d.depth!=draggingNode.depth){
          d3.select("body").select("#dialogbox2").style("display", "block")
          $("#mergenodes2").off("click")
          $("#mergenodes2").click(function(){
            clicked=true;
            duration=1000;
            if (draggingNode.parent!=d && d.parent!=draggingNode){//different level different branch    
                mergeNodes(draggingNode,d,root) 
                 update(root,svg,root)    

              //  permchanges.push(clonetree(root,root.depth,root.height))      
                      
            }else if(draggingNode.parent==d){
                mergeNodes(draggingNode,d,root) 
                update(d,svg,root)
              //   permchanges.push(clonetree(root,root.depth,root.height))
            }else if (draggingNode==d.parent){
              if (typeof d.children !='undefined')
                childcount = d.children.length
              
              if (childcount > 0) {//add children of d to the children of dragged node
                
                  for (j =0 ; j<childcount;j++){
                  
                    addtochildren(draggingNode,d.children[0])
                  }
              }else{
                transformNode(draggingNode,originalX,originalY)

              }
             
              draggingNode.data.name= d.data.name +"AND"+draggingNode.data.name; 
              d3.selectAll('.copys').remove();
              removelink(d);
              updatealltext();
              removedraggedNode(d)
             // deshadownode()
              update(root,svg,root)
            //  permchanges.push(clonetree(root,root.depth,root.height))
            
            }
            
            d3.select("body").selectAll("div.dialogbox").style("display", "none")
          });
          $("#mergenodes2").off("mouseenter")
          $("#mergenodes2").mouseenter(function(){
            duration=1000;
            if (draggingNode.parent!=d && d.parent!=draggingNode){
              rootC=clonetree(root,root.depth,root.height)
             //  console.log(rootC)
             // console.log(draggingNode)
                draggingNodeC=findNode(rootC,draggingNode);
              ///  console.log(draggingNodeC)
                dC=findNode(rootC,d)
              //  console.log(dC)
                mergeNodes(draggingNodeC,dC,rootC) 
                update(dC,svg,rootC)
                updatealltext()
                d3.select("#" + dC.data.name+dC.id).style("fill", "red");
                d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
                selectSubtree(dC,1000)

            }else if(draggingNode.parent==d){
              rootC=clonetree(root,root.depth,root.height)
               //console.log(rootC)
                var draggingNodeC=findNode(rootC,draggingNode);
                //console.log(draggingNodeC)
                var dC=findNode(rootC,d)
               // console.log(dC)
                mergeNodes(draggingNodeC,dC,rootC)//remove dragging node
                update(dC,svg,rootC)
                updatealltext()
                d3.select("#" + dC.data.name+dC.id).style("fill", "red");
               // d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
                selectSubtree(dC,1000)

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
               draggingNodeC.data.name= dC.data.name +"AND"+draggingNodeC.data.name; 
               update(rootC,svg,rootC)
               updatealltext();
               d3.selectAll('.copys').remove();
               removelink(dC);
               removedraggedNode(dC)
            //   deshadownode()
               update(rootC,svg,rootC)  
               updatealltext()
                //d3.select("#" + dC.data.name+dC.id).style("fill", "red");
               d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
               selectSubtree(draggingNodeC,1000)            
            }
          })
          $("#mergenodes2").off("mouseleave")
          $("#mergenodes2").mouseleave(function(){
            if (!clicked){
              svg.selectAll("*").remove();
              duration=0;
              update(root,svg,root)
             d3.select("#" + d.data.name+d.id).style("fill", "red");
             d3.select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");
      
            }
          })
        }//all other cases different level different branch
        return true;
      }else{

        return false;
      }//end of checking for distance
    })//end of svg selectall(g.node)
    svg.selectAll('line.link').filter(function(d,i){
      if (draggingNode.id!=d.id && isNearLine(draggingNode.x,draggingNode.y,d)){
        if (!touchedNode){
          
          d3.select("#"+d.data.name+d.id+"link").style("stroke", "red")
          d3.select("body").select("#dialogbox3").style("display", "block")
          $("#addtomiddle").off("click")
          $("#addtomiddle").click(function(){
            clicked=true;
            duration=1000;
           addtochildren(d.parent,draggingNode)
            addtochildren(draggingNode,d)
            //updateids(root)
          
           updatealltext();

           update(root,svg,root)
           d3.selectAll('.copys').remove();
           svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNode.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);

           d3.select("#"+d.data.name+d.id+"link").style("stroke", "#ccc")
         //  permchanges.push(clonetree(root,root.depth,root.height))
           d3.select("body").selectAll("div.dialogbox").style("display", "none")
         })
          $("#addtochildren").off("click")
         $("#addtochildren").click(function(){
          clicked=true;
          duration=1000;
            addtochildren(d.parent,draggingNode)
            updatealltext();
            update(root,svg,root)
            svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNode.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);
            //permchanges.push(clonetree(root,root.depth,root.height))
            d3.select("#"+d.data.name+d.id+"link").style("stroke", "#ccc")
            d3.select("body").selectAll("div.dialogbox").style("display", "none")
            d3.selectAll('.copys').remove();
         })
         $("#addtomiddle").off("mouseenter")
         $("#addtomiddle").mouseenter(function(){
            duration=1000;
            d3.select("#"+d.data.name+d.id+"link").style("stroke", "red")
            rootC=clonetree(root,root.depth,root.height)
            //console.log(rootC)
            var draggingNodeC=findNode(rootC,draggingNode);
           // console.log(draggingNodeC)

            var dC=findNode(rootC,d)
             addtochildren(dC.parent,draggingNodeC)
             addtochildren(draggingNodeC,dC)
             //deshadownode()
             d3.selectAll('.copys').remove();
             update(rootC,svg,rootC)
             svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNodeC.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);
             d3.select("#" + draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
             d3.select("#" + dC.data.name+dC.id).transition().duration(1000).style("fill", "red");
             selectSubtree(dC,1000)
             selectSubtree(draggingNodeC,1000)
         })
         $("#addtomiddle").off("mouseleave")
         $("#addtomiddle").mouseleave(function(){
            if (!clicked){
              svg.selectAll("*").remove();
              duration=0;

              update(root,svg,root)

              d3.select("#"+d.data.name+d.id+"link").style("stroke", "red")
              d3.select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");

            }
         })
         $("#addtochildren").off("mouseenter")
         $("#addtochildren").mouseenter(function(){
          duration=1000;
            d3.select("#"+d.data.name+d.id+"link").style("stroke", "red")
            rootC=clonetree(root,root.depth,root.height)
            //console.log(rootC)
            var draggingNodeC=findNode(rootC,draggingNode);
           // console.log(draggingNodeC)
            var dC=findNode(rootC,d)
            addtochildren(dC.parent,draggingNodeC)
           // deshadownode()
            d3.selectAll('.copys').remove();
            update(rootC,svg,rootC)
            console.log(d.parent.data.name)
            svg.selectAll("g.node").filter(function(k){
              if (k.id==draggingNodeC.id)
                return true;
              else{
                return false;
              }
             }).style("opacity",1);
            d3.select("#"+dC.parent.data.name+dC.parent.id).style("fill", "red");
            d3.select("#"+draggingNodeC.data.name+draggingNodeC.id).style("fill", "red");
            selectSubtree(draggingNodeC,1000)
         })
         $("#addtochildren").off("mouseleave")
         $("#addtochildren").mouseleave(function(){
            if (!clicked){
              svg.selectAll("*").remove();
              duration=0;
              update(root,svg,root)
              d3.select("#"+d.data.name+d.id+"link").style("stroke", "red")
              d3.select("#" + draggingNode.data.name+draggingNode.id).style("fill", "red");
            }
         })

        }
        return true
        }else{
          return false
        }

    })//end of selecting from links
  d3.select(this).classed("active", false);
  
}



});
function windowClose(){
  d3.select("body").selectAll("div.dialogbox").style("display", "none")
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
    newNode.x=node.x;
    newNode.y=node.y;
    newNode.x0=node.x0;
    newNode.y0=node.y0;

    //newNode.height = root.height - 1
    if(!isleaf){
      newNode.children=[];
      newNode.data.children=[];
    }
   
    return newNode;
}
