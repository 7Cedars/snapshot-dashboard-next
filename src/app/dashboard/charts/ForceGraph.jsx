import { useEffect, useRef } from 'react';
import { useDimensions } from '@/app/hooks/useDimensions';
import { DrawForceGraph } from './DrawForceGraph';
import { dummyData } from '../../../../public/data/dummyNetworkData';
import { useNetworkData } from '@/app/hooks/useNetworkData';
import { useProposals } from '@/app/hooks/useProposals';

export const ForceGraph = () => {  
  const svg = useRef(null);
  const { networkData } = useNetworkData()
  const { allProposals, selectedProposals, status } = useProposals()
  const { height: heightDiv, width: widthDiv } = useDimensions(svg)

  console.log("from useProposal: ", {
    allProposals: allProposals, 
    selectedProposals: selectedProposals, 
    status: status
  })
  
  console.log({
    heightDiv: heightDiv, 
    widthDiv: widthDiv
  })
  console.log("networkData: ", networkData)

  useEffect(() => {
    if (
      networkData?.current?.nodes && 
      networkData?.current?.links &&
      svg && 
      widthDiv != 0) {// && statusAtgetNetworkData.current == "isSuccess" 
        svg.current.replaceChildren()
        svg.current.appendChild( DrawForceGraph(networkData.current , { //appendChild // networkData.current // dummyData
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
  }, [widthDiv, heightDiv, networkData.current]) //statusAtgetNetworkData.current

  console.log("svg.current: ", svg.current)

  return (
    <div ref = {svg} className='h-full' />   
  )
};
