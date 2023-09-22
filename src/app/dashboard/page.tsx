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
     
      <div className="mt-20 w-96 pt-4 mx-2 flex flex-row max-h-screen text-sm place-content-center px-1 py-5 ">
        <div className="p-2 grid grid-cols-1 h-auto place-content-start m-1 border border-gray-500 rounded-lg shadow-lg bg-gray-100"> 
          <SpacesList selectedSpaces = {selectedSpaces}/>
        </div>
      </div>
      
      <div className='mt-20 flex-grow pt-4 grid grid-cols-1 lg px-1 py-5 '> 
        <div className='p-2 m-1 border border-gray-500 rounded-lg shadow-lg bg-gray-100'>
          <TimeRangeSlider dateRange = {dateRange}/> 
          
          <HeatMap />
          <NetworkChart />
        </div>
      </div> 
    </> 

  );
}
