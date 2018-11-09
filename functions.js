function duplicatebranches(draggedNode,d){
  console.log(draggedNode)
  console.log(d)
  var childcount=0;
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
  console.log(draggedNode.data.name)
   
   d3.selectAll('.copys').remove();
   //removelink(draggedNode);
   //removedraggedNode(draggedNode)
   //console.log(root)
  // transformNode(draggedNode,originalX,originalY);
  // updatealltext();
   deshadownode();
  // console.log(root);
   
  
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
  return foundnode

}
function deshadownode(){
  svg.selectAll('g.node').append("circle")
        .attr('r', 10).style("fill", function(d) {
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

}
function removelink(draggedNode){
  svg.selectAll('line.link').filter(function(d, i) { 
    if(d == draggedNode)
    { return true;}
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