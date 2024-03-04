// Copyright 2021-2023 Observable, Inc.
// slightly adapted by 7Cedars. 
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
import * as d3 from "d3"

export function DrawForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links // an iterable of link objects (typically [{source, target}, …])
}, {
  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeFill = "#ffffff", // node stroke fill (if not using a group color encoding)
  nodeStroke = "#584c77", // node stroke color
  nodeStrokeWidth = 5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius,  // = 5, // node radius, in pixels
  nodeRadia, // = [2, 3, 1, 5, 9, 16, 5, 15],
  nodeStrength,
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength,
  colors = [`#383867`, `#584c77`, `#33431e`, `#a36629`, `#92462f`, `#b63e36`, `#b74a70`, `#946943`],  // d3.schemeTableau10, // an array of color strings, for the node groups
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  invalidation // when this promise resolves, stop the simulation
} = {}) {
  // Compute values.
  console.log("ForceGraph CALLED")
  console.log("nodeRadius: ", nodeRadius)

  const N = d3.map(nodes, nodeId).map(intern);
  console.log("N: ", N)
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  console.log("T: ", T)
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const R = nodeRadius == null ? null : d3.map(nodes, nodeRadius);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  console.log("R: ", R)
  console.log("W: ", W)

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));
  // Here I think should set backgtound images. 

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color =  nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink.strength(linkStrength);

  const simulation = d3.forceSimulation(nodes)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("center",  d3.forceCenter())
      .on("tick", ticked);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  

  const backgroundImage = svg.append("defs").append("pattern")
      .attr('id','daoIcon')
      .attr("x", 1)
      .attr("y", 1)
      .attr("width", 1)
      .attr("height", 1)
      .attr('patternUnits',"objectBoundingBox")
    .append('image')
      .attr('href',`https://cdn.stamp.fyi/space/manablog-org.eth?s=96`)
      .attr('height', 40) // = radius X2 
      .attr('width', 40) 

  const link = svg.append("g")
      .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
      .attr("stroke-opacity", linkStrokeOpacity)
      .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
      .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg.append("g")   
      .attr("fill", "url(#daoIcon)") // nodeFill `url(${new URL(`https://cdn.stamp.fyi/space/manablog-org.eth?s=96`)})`
      .attr("stroke-opacity", nodeStrokeOpacity)
      .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r",  8) // standard nodeRadius in case radius not defined. 
      .call(drag(simulation))
    
  if (W) link.attr("stroke-width", ({index: i}) => W[i]);
  if (L) link.attr("stroke", ({index: i}) => L[i]);
  if (R) node.attr("r", ({index: i}) => R[i]);
  if (N) node.attr("stroke", ({index: i}) => color(N[i]));  

  // The following also (obv) not. 
  // if (N) node.append("image")
  //   .attr("xlink:href", ({index: i}) => `https://cdn.stamp.fyi/space/${N[i]}?s=96`)
  //   .attr("width", "24px")
  //   .attr("height", "24px") //
  // if (T) node.append("title").text(({index: i}) => T[i]).attr("fill", "#000000") .call(text => text.append("title").text("TRYOUT!")) ;
  //  if (T) node.append("text")
  //       .attr("x", 8)
  //       .attr("y", "0.31em")
  //       .attr("fill", "#000000")
  //       .text("TRYOUT!")
        // .call(text => text.append("title").text("TRYOUT!"))

  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function drag(simulation) {    
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  console.log("ForceGraph svg: ", svg)

  return Object.assign(svg.node(), {scales: {color}});
}