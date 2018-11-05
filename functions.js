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
 console.log(f.parent.children.length)
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
 update(d)
 
} 
function removelink(draggedNode){
  svg.selectAll('line.link').filter(function(d, i) { 
    if(d == draggedNode)
    { return true;}
      return false;
    }).remove()
}
function updatealltext(){
  svg.selectAll('g.node').select("text").text(function(d) { return d.data.name; });

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
function clonetree(root, depth, height){

  var cloneroot=clonenode(root, typeof root.children=='undefined', depth, height)
  console.log(cloneroot)

  if (typeof root.children!='undefined'){
   // console.log("entered here")
   console.log("root.children length")
   console.log(root.children.length)
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
    //newNode.height = root.height - 1
    if(!isleaf){
      newNode.children=[];
      newNode.data.children=[];
    }
   
    return newNode;
}
function deshadownode(){
  svg.selectAll('g.node').append("circle")
                                .attr('r', 10).style("fill", function(d) {
                          return "#0e4677";
                        })
}