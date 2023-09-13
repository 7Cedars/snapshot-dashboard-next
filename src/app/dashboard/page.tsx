import { SearchParams } from '../../types';
import { 
  getStartDateFromUrlParams, 
  getEndDateFromUrlParams,
  getSpacesFromUrlParams } from '../utils/getDataFromUrl';
import SpacesList from './SpacesList';


type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const startDate = getStartDateFromUrlParams(searchParams);
  const endDate = getEndDateFromUrlParams(searchParams);
  const selectedSpaces = getSpacesFromUrlParams(searchParams);

  console.log({
    startDate: startDate,
    endDate: endDate, 
    selectedSpaces: selectedSpaces
  })

  return (
    
    <div className="pt-40 flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
      <div> 
        <SpacesList selectedSpaces = {selectedSpaces}/>
      </div>

      {/* <NetworkComponent />
      <HeatMap />
      <RangeSlider />  */}
    </div> 

  );
}
