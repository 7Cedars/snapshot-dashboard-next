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
import { useAppDispatch } from '@/redux/hooks';
import { updateModal } from '@/redux/reducers/userInputReducer';
import SpaceItem from './SpaceItem';
import { useScreenDimensions } from '../hooks/useScreenDimensions';

export default function Page() {
  const { selectedSpaces } = useSpaces()
  const { height, width } = useScreenDimensions()  
  const notCached = proposalsOfSpaceNotCached(selectedSpaces)
  const spacesToQuery = notCached.notCached
  const { queriesLength } = useVotes()
  const dispatch = useAppDispatch()

  const heatmapHeight = selectedSpaces.length * 25 + 20
  const networkDiagramHeight = height - (selectedSpaces.length * 25 + 320)

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
      <div className='w-96 h-full space-y-0 pt-4 grid grid-cols-1 ps-12'> 
        <div className='mt-20 p-2 border border-gray-500 border-r-0 rounded-l-lg shadow-lg bg-gray-200 flex flex-col  overflow-auto'>

          {/* search box */}
          <form>
            <input
              className="p-2 w-full border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
              type="search" 
              id="mySearch"
              name="q"
              placeholder="Search and select DAOs…" 
              onClick={() => dispatch(updateModal('search'))}
              onChange={() => dispatch(updateModal('search'))}
              />
          </form>

          {/* list of selected spaces */}
          <div className='flex flex-col overflow-auto'>
          {
            selectedSpaces.length === 0 ? 
            <i className="grid justify-items-center my-4 text-gray-500"> No DAO spaces selected. </i>
            :
            selectedSpaces.map(spaceId => (
              < SpaceItem key = {spaceId} spaceId = {spaceId}/> 
            ))
          }
          </div>
        </div>
      </div>
      
      <div className='flex flex-grow h-full space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        <div className='mt-20 p-2 border border-gray-500 border-l-0 rounded-r-lg shadow-lg bg-gray-100 flex flex-col'>
          
          {/* Time range slider */}
          <TimeRangeSlider/> 
          
          {/* Network Diagram */}
          <div className="border border-gray-300 mt-4 rounded-lg items-center flex-auto"> 
          { queriesLength && queriesLength > 0 ? 
            <p> Loading .... </p>
            :
            <ChartCanvas
              VizComponent={NetworkDiagram}
              vizName={"NetworkDiagram"}
              maxWidth={3000}
              height={networkDiagramHeight}
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
