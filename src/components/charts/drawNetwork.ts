import { Link, Node } from "../../types";

export const RADIUS = 10;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[]
) => {
  context.clearRect(0, 0, width, height);

  // Draw the nodes
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = '#cb1dd1';
    context.fill();
  });

   links.forEach((link) => {
      context.beginPath();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // this seems to be a bug in d3
      context.moveTo(link.source.x, link.source.y); 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // this seems to be a bug in d3
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
  });
};
