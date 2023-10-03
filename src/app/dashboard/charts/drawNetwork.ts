import { Link, Node } from "../../../types";
import { colourCodes } from "../../../../constants";
import d3, { scaleOrdinal, schemeCategory10 } from 'd3';

export const RADIUS = 15;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[]
) => {
  context.clearRect(0, 0, width, height);

    // Color Scale
    const allIds = [...new Set(nodes.map((d) => String(d.id)))];
    const colorScale = scaleOrdinal<string>()
    .domain(allIds)
    .range(colourCodes);

  // Draw the nodes
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorScale(String(node.id)); // '#ef4444';
    context.fill();
  });

   links.forEach((link) => {
      context.beginPath();
      // @ts-ignore
      // this seems to be a bug in d3
      context.moveTo(link.source.x, link.source.y); 
      // @ts-ignore
      // this seems to be a bug in d3
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
  });
};
