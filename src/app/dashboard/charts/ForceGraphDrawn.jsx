import { useEffect, useRef } from "react";
import { ForceGraph } from "./ForceGraph";
import { dummyData } from "../../../../public/data/dummyNetworkData";

export const ForceGraphDrawn = ({
  width = 20000,
  height = 2000,
}) => {
  if (width === 0) {
    return null;
  }

  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const {} = useDimensions(canvasRef) 

  // // useEffect(() => {

  //   ForceGraph(dummyData, {
  //     nodeId: d => d.id,
  //     nodeGroup: d => d.group,
  //     nodeTitle: d => `${d.id}\n${d.group}`,
  //     linkStrokeWidth: 2,// l => Math.sqrt(l.value),
  //     width,
  //     height: height, 
  //     invalidation // a promise to stop the simulation when the cell is re-run
  //   })

  // }, [width, height]);

  const graph = ForceGraph(dummyData, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    nodeTitle: d => `${d.id}\n${d.group}`,
    linkStrokeWidth: 2,// l => Math.sqrt(l.value),
    width,
    height: height, 
    // invalidation // a promise to stop the simulation when the cell is re-run
  })

  console.log("graph: ", graph)

  return graph;
}
