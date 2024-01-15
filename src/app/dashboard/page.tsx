"use client"; 

import SpacesList from './SpacesList';
import TimeRangeSlider from './TimeRangeSlider';
import { ChartCanvas } from '../ui/ChartCanvas';
import { NetworkDiagram } from './charts/NetworkDiagram';
import { useSpaces } from '../hooks/useUrl';
import { proposalsOfSpaceNotCached } from '../utils/checkCache';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@apollo/client';
import { PROPOSALS_FROM_SPACES } from '../utils/queries';
import { Heatmap } from './charts/Heatmap';
import { useVotes } from '../hooks/useVotes';

export default function Page() {
  const { selectedSpaces } = useSpaces()
  const notCached = proposalsOfSpaceNotCached(selectedSpaces)
  const heatmapHeight = selectedSpaces.length * 25 + 20
  const spacesToQuery = notCached.notCached
  const { queriesLength } = useVotes()

  console.log("queriesLength: ", queriesLength)

  spacesToQuery.push(" ") // if no spaces need to be queried, it queries an empty space. 

  const { error }: UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: spacesToQuery} 
  });

  if (error) return `Error! ${error}`; // needs to be transformed to proper notification 


  return (    
    
    <div className="absolute top-0 h-screen w-full h-full flex flex-row space-x-0 border-2 border-red-800">
      <div className='w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        <div className='mt-20 p-2 border border-gray-500 border-r-0 rounded-l-lg shadow-lg bg-gray-300'>
          <SpacesList />
        </div>
      </div>
      
      <div className='flex flex-grow h-full space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        <div className='mt-20 p-2 border border-gray-500 border-l-0 rounded-r-lg shadow-lg bg-gray-100 flex flex-col'>
          <TimeRangeSlider/> 
          
          {/* Network Diagram */}
          <div className="border border-gray-300 mt-4 rounded-lg items-center flex-auto"> 
          { queriesLength && queriesLength > 0 ? 
            <p> Loading .... </p>
            :
            <ChartCanvas
              VizComponent={NetworkDiagram}
              vizName={"NetworkDiagram"}
              maxWidth={2000}
              height={500}
              />
          }
          </div>

          {/* Heatmap */}
          <div className="border border-gray-300 mt-4 rounded-lg"> 
            <ChartCanvas
              VizComponent={ Heatmap }
              vizName={"heatmap"}
              maxWidth={3000}
              height={heatmapHeight}
              />
          </div>
          
        </div>
      </div> 
    </div> 
  );
}
