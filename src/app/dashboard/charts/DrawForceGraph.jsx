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
  nodeStrokeWidth = 5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius,  // = 5, // node radius, in pixels
  nodeColour,
  nodeStrength = -150,
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength = .025,
  // colors = colourCodes,  // d3.schemeTableau10, // an array of color strings, for the node groups
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
  const C = nodeColour == null ? null : d3.map(nodes, nodeColour);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  console.log("R: ", R)
  console.log("C: ", C)
  console.log("W: ", W)
  console.log("N: ", N)

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  // const color =  nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

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
  
// setting background patterns for each selected DAO. 
// £ack https://stackoverflow.com/questions/14610954/can-an-svg-pattern-be-implemented-in-d3 
  nodes.forEach((node, i) => 
    svg.append("defs").append("pattern")
      .attr('id',`${node.id}`) // name = node.id 
      .attr("x", 1)
      .attr("y", 1)
      .attr("width", 1)
      .attr("height", 1)
      .attr('patternUnits',"objectBoundingBox")
    .append('image')
      .attr('href',`https://cdn.stamp.fyi/space/${node.id}?s=96`)
      .attr('height', R[i] * 2) // = radius X2 
      .attr('width', R[i] * 2) 
    )

  const link = svg.append("g")
      .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
      .attr("stroke-opacity", linkStrokeOpacity)
      .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
      .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg.append("g")   
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
  if (C) node.attr("stroke", ({index: i}) => C[i]);
  if (N) node.attr("fill", ({index: i}) => `url(#${N[i]})`);  // And here fill is set by the pattern of node name :) 
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

  return Object.assign(svg.node()) // , {scales: {color}});

}