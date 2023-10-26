"use client"; 

import SpacesList from './SpacesList';
import TimeRangeSlider from './TimeRangeSlider';
import HeatMap from './Heatmap';
import NetworkChart from './NetworkChart';
// ps-12 
export default function Page() {

  return (    
    <>
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        <div className='p-2 border border-gray-500 border-r-0 rounded-l-lg shadow-lg bg-gray-300 h-4/5 '>
          <SpacesList />
        </div>
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        <div className='p-2 border border-gray-500 border-l-0 rounded-r-lg shadow-lg bg-gray-100 flex flex-col h-4/5'>
          <TimeRangeSlider/> 
          <NetworkChart /> 
          <HeatMap />
        </div>
      </div> 
    </> 
  );
}
