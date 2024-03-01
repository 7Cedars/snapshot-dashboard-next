import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { toNetworkGraph } from '@/app/utils/transposeData';
import { useApolloClient } from '@apollo/client';
import { useVotes } from '@/app/hooks/useVotes';
import { toProposals } from '@/app/utils/parsers';
import { useSpaces, useDateRange } from '@/app/hooks/useUrl';
import { useDimensions } from '@/app/hooks/useDimensions';
import { DrawForceGraph } from './DrawForceGraph';
import { useSnapShotApi } from '@/app/hooks/useSnapShotApi';
import { dummyData } from '../../../../public/data/dummyNetworkData';

export const ForceGraph = ({
  // width = 20000,
  // height = 2000,
}) => {
  
  // if (width === 0) {
  //   return null;
  // }

  // if (height === 0) {
  //   return null;
  // }

  const svg = useRef(null);
  const graphExists = useRef(false); 
  const {height: heightDiv, width: widthDiv} = useDimensions(svg)
  console.log({
    heightDiv: heightDiv, 
    widthDiv: widthDiv
  })

  // const {  networkData, statusAtgetNetworkData} = useSnapShotApi() 
  // console.log({
  //   networkData: networkData, 
  //   statusAtgetNetworkData: statusAtgetNetworkData
  // })

  // const svg = useRef(null) 

  useEffect(() => {

    if (svg && widthDiv != 0) { // && statusAtgetNetworkData.current == "isSuccess"
      // d3.select("svg").remove(); // does not work properly...
      const graph = DrawForceGraph(dummyData, { //appendChild // networkData
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeRadius: d => d.activity, 
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: widthDiv,
        height: heightDiv == 0 ? 400: heightDiv
        // invalidation // a promise to stop the simulation when the cell is re-run
        }, 
        dummyData)

        svg.current.replaceChildren()
        svg.current.appendChild(graph, svg.current)
    }
  }, [widthDiv, heightDiv]) //statusAtgetNetworkData.current

  console.log("svg.current: ", svg.current)

  return (
    <div ref = {svg} className='h-full' />   
  )
  
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // // const {} = useDimensions(canvasRef) 

  // useEffect(() => {
  //   // set dimension of the canvas element
  //   const canvas = canvasRef.current;
  //   const context = canvas?.getContext('2d');

  //   if (!context) {
  //     return;
  //   }

  //   // run d3-force to find the position of nodes on the canvas
  //   d3.forceSimulation(nodes)

  //     // list of forces we apply to get node positions
  //     .force(
  //       'link',
  //       d3
  //       .forceLink<Node, Link>(links)
  //       .id((d) => d.id)
  //       .strength((d) => d.strength)
  //     )
  //     .force('collide', d3.forceCollide().radius(RADIUS * 2.5))
  //     .force('charge', d3.forceManyBody().strength(2))
  //     .force('center', d3.forceCenter(width / 2, height / 2))
  //     .force('charge', d3.forceY(1).strength(.3))
  //     .force('charge', d3.forceX(1).strength(0))

  //     // at each iteration of the simulation, draw the network diagram with the new node positions
  //     .on('tick', () => {
  //       drawNetwork(context, width, height, nodes, links);
  //     });
  // }, [width, height, nodes, links]);

  // return (
  //   <div>
  //     <canvas
  //       ref={canvasRef}
  //       style={{
  //         width,
  //         height,
  //       }}
  //       width={width}
  //       height={height}
  //     />
  //   </div>
  // );
};
