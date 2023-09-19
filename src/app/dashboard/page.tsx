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

  // loadProposals(selectedSpaces)

  // console.log({
  //   searchParams: searchParams, 
  //   dateRange: dateRange,
  //   selectedSpaces: selectedSpaces
  // })

  return (    
    <>
      <div className="mt-20 col-span-1 pt-4 flex flex-row w-full max-h-screen text-sm place-content-center px-2 py-5 ">
        <SpacesList selectedSpaces = {selectedSpaces}/>
      </div>
      
      <div className='mt-20 col-span-2 grid grid-cols-1 m-2 py-5 px-2'> 
        <TimeRangeSlider /> 
        {/* <NetworkChart /> */}
        <HeatMap />
      </div> 
    </> 

  );
}
