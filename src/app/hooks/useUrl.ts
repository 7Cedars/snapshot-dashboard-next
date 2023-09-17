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
  const { dateA, dateB }  = getDateRangeFromUseSearchParams(params);

  const handleDates = (dateA: string, dateB: string) => {
    // console.log("handleDates called.")
    let newParams = new URLSearchParams(params.toString());
    newParams.set('dateA', dateA)
    newParams.set('dateB', dateB)
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { dateA, dateB, handleDates };
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

  // because deleting single item is not supported yet: need to delete all, and then repopulate. 
  const removeSpace = (spaceId: String) => {
    let newParams = new URLSearchParams(params.toString());

    const newSpaceParams = newParams.getAll('space');
    const updatedSpaces = newSpaceParams.filter(item => item !== spaceId)

    newParams.delete('space')
    updatedSpaces.forEach(spaceId => newParams.append('space', spaceId))

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { selectedSpaces, addSpace, removeSpace };
}
