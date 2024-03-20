import { useEffect, useRef } from 'react';
import { useDimensions } from '@/app/hooks/useDimensions';
import { DrawForceGraph } from './DrawForceGraph';
import { useNetworkData } from '@/app/hooks/useNetworkData';

export const ForceGraph = () => {  
  const svg = useRef(null);
  const { networkData } = useNetworkData()
  const { height: heightDiv, width: widthDiv } = useDimensions(svg)

  useEffect(() => {
    if (
      networkData && 
      networkData.nodes && 
      networkData.links &&
      svg && 
      widthDiv != 0) {
        svg.current.replaceChildren()
        svg.current.appendChild( DrawForceGraph(networkData , { 
          nodeId: d => d.id,
          nodeGroup: d => d.group,
          nodeRadius: d => d.radius, 
          nodeColour: d => d.colour, 
          nodeTitle: d => `${d.id}`,
          linkStrokeWidth: l => Math.sqrt(l.value),
          width: widthDiv,
          height: heightDiv == 0 ? 400: heightDiv
          // invalidation // a promise to stop the simulation when the cell is re-run
          }), svg.current)
      }
  }, [widthDiv, heightDiv, networkData]) 

  return (
    <div ref = {svg} className='h-full' />   
  )
};
