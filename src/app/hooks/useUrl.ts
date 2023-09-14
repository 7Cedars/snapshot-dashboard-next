"use client"


import { 
  Space
} from '../../types';
import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from 'next/navigation';
import { 
  getDateRangeFromUseSearchParams,
  getSpacesFromUseSearchParams
} from '../utils/getDataFromUseSearch';

export function useDateRange() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dateRange = getDateRangeFromUseSearchParams(params);

  const handleDates = (dates: [string, string]) => {
    let newParams = new URLSearchParams(params.toString());
    newParams.delete('date')
    dates.forEach(date => newParams.append('date', date))
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { dateRange, handleDates };
}

export function useSpaces() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedSpaces = getSpacesFromUseSearchParams(params);

  const addSpace = (space: Space) => {
    let newParams = new URLSearchParams(params.toString());
    newParams.append('space', space.id)
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // because deleting single item is not supported yet, need to do it in a roundabout way. 
  const removeSpace = (spaceId: String) => {
    let newParams = new URLSearchParams(params.toString());

    const newSpaceParams = newParams.getAll('space');

    //  const newParamsArray = Array.from(newSpaceParams).map(item => item[1])
    const updatedSpaces = newSpaceParams.filter(item => item !== spaceId)

    newParams.delete('space')
    updatedSpaces.forEach(spaceId => newParams.append('space', spaceId))

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { selectedSpaces, addSpace, removeSpace };
}
