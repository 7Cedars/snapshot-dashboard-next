import { 
  Space, 
  StartDate, 
  EndDate 
} from '../../types';
import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from 'next/navigation';
import { 
  getStartDateFromUseSearchParams,
  getEndDateFromUseSearchParams,
  getSpacesFromUseSearchParams
} from '../utils/getDataFromUseSearch';

// NB: I do not know if the hooks below will work. 
// Because I have three different. See and fix if needed. 

export function useStartDate() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const startDate = getStartDateFromUseSearchParams(params);

  const handleStartDate = (value: StartDate) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('startDate', String(value));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { startDate, handleStartDate };
}

export function useEndDate() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const endDate = getEndDateFromUseSearchParams(params);

  const handleEndDate = (value: EndDate) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('endDate', String(value));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { endDate, handleEndDate };
}

export function useSpaces() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedSpaces = getSpacesFromUseSearchParams(params);

  const handleSpaces = (value: Space) => {
    let newParams = new URLSearchParams();
    newParams.append('space', value.id)
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { selectedSpaces, handleSpaces };
}
