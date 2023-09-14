"use client"; 

import { SearchParams } from '../../types';
import { 
  getSpacesFromUrlParams, 
  getDateRangeFromUrlParams} from '../utils/getDataFromUrl';
import SpacesList from './SpacesList';
import TimeRangeSlider from './TimeRangeSlider';

type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const selectedSpaces = getSpacesFromUrlParams(searchParams);
  const dateRange = getDateRangeFromUrlParams(searchParams)

  console.log({
    searchParams: searchParams, 
    dateRange: dateRange,
    selectedSpaces: selectedSpaces
  })

  return (    
    <div className="pt-4 flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
      <div> 
        <SpacesList selectedSpaces = {selectedSpaces}/>
      </div>

      {/* <NetworkComponent /> */}
      {/* <HeatMap /> */}
      TEST TEST
      <TimeRangeSlider /> 
    </div> 

  );
}
