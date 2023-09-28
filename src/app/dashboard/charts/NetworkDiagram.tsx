import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { RADIUS, drawNetwork } from './drawNetwork';
import { Link, Node, Vote } from '../../../types';
import { data } from '../../../../public/data/dummyNetworkData';
import { toNetworkGraph } from '@/app/utils/transposeData';
import { useApolloClient } from '@apollo/client';
import { toVotes } from '@/app/utils/parsers';
import { useVotes } from '@/app/hooks/useVotes';
import { toProposals } from '@/app/utils/parsers';
import { useSpaces, useDateRange } from '@/app/hooks/useUrl';
import { toSelectedProposals } from '@/app/utils/utils';
import { Proposal } from '../../../types';
import { useLazyQuery } from '@apollo/client';
import { VOTERS_ON_PROPOSALS } from '@/app/utils/queries';

type NetworkDiagramProps = {
  width: number;
  height: number;
};





export const NetworkDiagram = ({
  width = 700,
  height = 300,
}: NetworkDiagramProps) => {
  if (width === 0) {
    return null;
  }




  

  ///////////////////////////// 

  // const { cache }  = useApolloClient()
  // const cachedQueries = Object.values(cache.extract())
  //     .filter(item => item.__typename === 'Query')[0]
  //   const cachedQueriesFlat = (Array.from(Object.values(cachedQueries))).flat()

  //   console.log("cachedQueriesFlat: ", cachedQueriesFlat)
    
  //   const cachedVotes: Vote[] = toVotes(cachedQueriesFlat
  //     .filter((item: any) => item.__typename === 'Vote' )
  //   )

  // const test = toNetworkGraph(cachedVotes) 


  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links: Link[] = data.links.map((d) => ({ ...d }));
  const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // set dimension of the canvas element
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    // run d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        'link',
        d3.forceLink<Node, Link>(links).id((d) => d.id)
      )
      .force('collide', d3.forceCollide().radius(RADIUS))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on('tick', () => {
        drawNetwork(context, width, height, nodes, links);
      });
  }, [width, height, nodes, links]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
};
