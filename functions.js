function clone(selector) {
    var node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true),
node.nextSibling));
}
function duplicatebranches(g,k){
  //console.log(draggedNode)
  //console.log(d)
  var childcount=0;
  if (typeof g.children !='undefined')
       childcount = g.children.length
     
     if (childcount > 0) {//add children of dragged node to the children of d node
         for (j =0 ; j<childcount;j++)
           addtochildren(k,g.children[0])
         }
         var copysubtree=clonetree(k, g.depth, g.height);
         var nodeupdates=copysubtree.descendants();
         
        // console.log("copysubtree")
        // console.log(copysubtree)
         if (typeof copysubtree.children!='undefined'){
          copysubtree.children.forEach(function(f){
          f.parent=g;
             if (typeof g.children != 'undefined') {
                  g.children.push(f);
              } else {
                  g.children=[];
                  g.data.children=[];
                  g.children.push(f);
              }
              g.data.children.push(f.data);
          })
         }
         
  
   g.data.name= k.data.name+"AND" + g.data.name;

  
   k.data.name= g.data.name;
}
function findNode(rootC,d){
  var nodes = rootC.descendants()
 // console.log(nodes)
  var foundnode;
  if (d.id==rootC.id){
    
    foundnode = rootC;
  }else{
   nodes.forEach(function(f){
      if (d.id==f.id){
      foundnode=f;
    }
  });
  }
 // console.log("foundnode")
 // console.log(foundnode)
  return foundnode

}
function deshadownode(){
  svg.selectAll('g.node').append("circle")
        .attr('r', 10).style("opacity",1.0).style("fill", function(d) {
        return "#0e4677";
       })
}
function distance(x1,y1, x2,y2){
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
function addtochildren(d,f){

 // console.log(draggedNode.parent)
  var index = f.parent.children.indexOf(f);
 // console.log(index)
 if (index > -1) {
   f.parent.children.splice(index, 1);
   f.parent.data.children.splice(index, 1);
 }
 //console.log(f.parent.children.length)
 if (f.parent.children.length == 0)
 {
  delete f.parent.children
  delete f.parent.data.children
 }
 //console.log("children of parent of draggedNode")
 //console.log(f.parent.children)
 f.depth = d.depth + 1; 
 f.height = d.height - 1;
 f.parent=d;
 if (typeof d.children !== 'undefined') {
      d.children.push(f);
  } else {
      d.children=[];
      d.data.children=[];
      d.children.push(f);
  }

 d.data.children.push(f.data);

 
} 
function updatealltext(){
  svg.selectAll('g.node').select("text").text(function(d) { return d.data.name; });
  svg.selectAll('g.node').select('circle').attr("id", function(d){return d.data.name+d.id})
  svg.selectAll('line.link').attr("id", function(d){return d.data.name+d.id+"link"})
  //console.log(svg.selectAll('g.node').select('circle'))

}
function removelink(draggedNode){
  console.log("draggedNode")
  console.log(draggedNode)
  svg.selectAll('line.link').filter(function(d, i) { 
    if(d.id == draggedNode.id)
    { console.log(d)
      return true;}
      return false;
    }).remove()
}
function removedraggedNode(f){
  svg.selectAll('g.node')
    .filter(function(d, i) {
      if (d == f){
        return true;
      }else{
        return false;
      }
   }).remove();
    //remove the data too

  var index = f.parent.children.indexOf(f);
   // console.log(index)
   if (index > -1) {
     f.parent.children.splice(index, 1);
     f.parent.data.children.splice(index, 1);
   }
   if (f.parent.children.length == 0)
      {
       delete f.parent.children
       delete f.parent.data.children
       }

}
function isNearLine(x,y,d){
  var x1;
  var y1;
  var x2;
  var y2;
  threshold= 1100
  if (d.parent==null)//root of the tree
  {
    x1= root.x0
     y1=0;
   }else{
     x1 = d.parent.x;
     y1 = d.parent.y;
   }
   x2= d.x;
   y2 = d.y;
   if (d.parent.x == x && d.parent.y==y)
    return false
   
   dxc = x - x1;
  // console.log("dxc")
  // console.log(dxc)
   dyc = y-y1;
  // console.log("dyc")
  // console.log(dyc)
   dxl = x2-x1;
   dyl = y2-y1;
  /* console.log("dxl")
   console.log(dxl)
   console.log("dyl")
   console.log(dyl)*/

   cross = (dxc * dyl) - (dyc * dxl);
  // console.log("cross")
  // console.log(cross)
   if (Math.abs(cross) >=threshold)
    return false;
  if (Math.abs(dxl) >= Math.abs(dyl))
    if (dxl>0 ){
      return x1<=x && x<=x2
    }else{
      return x2<=x && x<=x1
    }
  else
    if (dyl > 0)  
     return  y1 <= y && y <= y2 
   else
     return y2 <= y && y <= y1;
   

}
function transformNode(draggedNode,originalX,originalY){
  draggedNode.x=originalX;
  draggedNode.y=originalY;
  svg.selectAll('g.node').filter(function (d,i){
    if (d == draggedNode){
      return true;
    }
    return false;
    
  }).attr("transform", "translate(" + originalX + "," + originalY + ")");
}
function mergeNodes(draggedNode,d,root){
  var childcount=0;
  if (typeof draggedNode.children !='undefined'){             
        childcount = draggedNode.children.length
  }
               
    if (childcount > 0) {//add children of dragged node to the children of d node
                 
         for (j =0 ; j<childcount;j++){
                   
            addtochildren(d,draggedNode.children[0])
         }
                 
     }
              //console.log(f.parent.children.length)
               
       d.data.name= d.data.name+"AND" + draggedNode.data.name;
       
       updatealltext()
       
       d3.selectAll('.copys').remove();

       removelink(draggedNode);
       
       removedraggedNode(draggedNode)
}
function updateids(root){
  var nodez=root.descendants();
  var j  = 0;
  nodez.forEach(function(f){
    return f.id=++j;
  })
}
function removeTempChanges(dragedC,dC,draggedNodechildren,dchildren,svg){
  
  console.log(dchildren)
  svg.selectAll('g.node').filter(function(h,i){
    if (h.parent==dragedC){
      console.log("h")
      console.log(h)
      var found=false;
      dchildren.forEach(function(f){

        if (f.id==h.id){
         
          found=true;
        }
      })
      return found;
    
    }else{
      return false;
    }
    
  }).remove();

}

function centerNode(source,k,width,height) {
        k = d3.event.transform.k;
        x = -source.y0;
        y = -source.x0;
        x = x * k + width / 2;
        y = y * k + height / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + k + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }