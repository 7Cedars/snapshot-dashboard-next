"use client"; 

import { SearchParams } from '../../types';
import { 
  getSpacesFromUrlParams, 
  getDateRangeFromUrlParams} from '../utils/getDataFromUrl';
import SpacesList from './SpacesList';
import TimeRangeSlider from './TimeRangeSlider';
import loadProposals from '../utils/loadProposals';
import HeatMap from './Heatmap';
import NetworkChart from './NetworkChart';

type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const selectedSpaces = getSpacesFromUrlParams(searchParams);
  const dateRange = getDateRangeFromUrlParams(searchParams)

  return (    
    <>

<div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 lg ps-12 py-5'> 
      <div className='p-2 border border-gray-500 border-r-0 rounded-l-lg shadow-lg bg-gray-300'>
          <SpacesList selectedSpaces = {selectedSpaces}/>
        </div>
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 lg pe-12 py-5'> 
        <div className='p-2 border border-gray-500 border-l-0 rounded-r-lg shadow-lg bg-gray-100'>
          <TimeRangeSlider dateRange = {dateRange}/> 
          
          <HeatMap />
          <NetworkChart />
        </div>
      </div> 
    </> 

  );
}
