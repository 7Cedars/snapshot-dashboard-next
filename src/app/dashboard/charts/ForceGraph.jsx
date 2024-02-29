import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { toNetworkGraph } from '@/app/utils/transposeData';
import { useApolloClient } from '@apollo/client';
import { useVotes } from '@/app/hooks/useVotes';
import { toProposals } from '@/app/utils/parsers';
import { useSpaces, useDateRange } from '@/app/hooks/useUrl';
import { useDimensions } from '@/app/hooks/useDimensions';
import {dummyData} from '../../../../public/data/dummyNetworkData'
import { ForceGraph } from './DrawForceGraph';

export const NetworkDiagram = ({
  width = 20000,
  height = 2000,
}) => {
  if (width === 0) {
    return null;
  }
  
  const { selectedSpaces } = useSpaces()
  const { d1, d2 } = useDateRange()
  const svg = useRef(null) 
  const { fetchVotes, queriesLength } = useVotes() 
  const { cache }  = useApolloClient()
  const cachedProposals = toProposals({
    proposals: Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")})

  let data = {nodes: [], links: []}
  // NB: HERE DUMMY DATA IS INSERTED
  // data = dummyData 

  console.log("queriesLength at networkdiagram: ", queriesLength)
  const selectedProposals = cachedProposals.filter(proposal => selectedSpaces.includes(proposal.space.id))

  const votes = fetchVotes(selectedSpaces, d1, d2, true)
  if (queriesLength > 2) { 
    data = toNetworkGraph(votes, selectedProposals) 
  }  

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  // const links: Link[] = data.links.map((d) => ({ ...d }));
  // const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

  useEffect(() => {

    if (svg && data.nodes.length > 0) {
      d3.select("svg").remove(); // does not work properly... 
      svg.current.appendChild(ForceGraph(data, { //appendChild
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: 400,
        height: 400, 
        // invalidation // a promise to stop the simulation when the cell is re-run
        }), 
        svg.current
      )
    }
  }, [data])

  console.log("svg.current: ", svg.current)

  return (
    <div ref = {svg} />   
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
