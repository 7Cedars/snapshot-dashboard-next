"use client"; 

import TimeRangeSlider from './TimeRangeSlider';
import { useSpaces } from '../hooks/useUrl';
import { useAppDispatch } from '@/redux/hooks';
import { updateModal } from '@/redux/reducers/userInputReducer';
import SpaceItem from './SpaceItem';
import { ForceGraph } from './charts/ForceGraph';
import InfoSpaceDialog from '../modals/InfoSpace';
import { ScreenTooSmall } from '../modals/ScreenTooSmall';
import { useDimensions } from '../hooks/useDimensions';
import { useRef } from 'react';


export default function Page() {
  const { selectedSpaces } = useSpaces()
  const dispatch = useAppDispatch()
  const screenSize = useRef(null) 
  const {height, width} = useDimensions(screenSize)

  return ( 
    <div className="absolute top-0 h-screen w-full h-full flex flex-row space-x-0" ref = {screenSize}>
      <ScreenTooSmall height = {height} width = {width} /> 
      <InfoSpaceDialog/> 
      <div className='w-96 h-full space-y-0 py-4 grid grid-cols-1 ps-12'> 
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
      
      <div className='flex flex-grow space-y-0 py-4 grid grid-cols-1 pe-12'> 
        <div className='mt-20 p-2 border border-gray-500 border-l-0 rounded-r-lg shadow-lg bg-gray-100 flex flex-col grow'>
          
          {/* Time range slider */}
          <TimeRangeSlider/> 
          
          {/* Network Diagram */}
          <div className="border border-gray-300 mt-4 rounded-lg items-center flex-auto"> 
            <div className='z-20 h-full w-full' > 
              <ForceGraph />  
            </div> 
          </div>
        </div>
      </div> 
    </div> 
  );
}
