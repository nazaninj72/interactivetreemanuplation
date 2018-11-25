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
        // console.log("copysubtree")
        // console.log(copysubtree)
         if (typeof copysubtree.children!='undefined'){
          copysubtree.children.forEach(function(f){
          f.parent=g;
             if (typeof g.children !== 'undefined') {
                  g.children.push(f);
              } else {
                  g.children=[];
                  g.data.children=[];
                  g.children.push(f);
              }
              g.data.children.push(f.data);
          })
         }
         
  
   g.data.name= k.data.name+"&" + g.data.name;

  
   k.data.name= g.data.name;
   console.log("draggedNode.data.name")
   console.log(g.data.name)
   updatealltext();
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
 // console.log("foundnode")
 // console.log(foundnode)
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
               
       d.data.name= d.data.name+"&" + draggedNode.data.name;
       update(d,svg,root)
       updatealltext()
       
       d3.selectAll('.copys').remove();

       removelink(draggedNode);
       
       removedraggedNode(draggedNode)
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