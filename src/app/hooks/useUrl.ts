import { 
  SelectedSpaces, 
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
  getEndDateFromUseSearchParams 
} from '../utils/getDataFromUrl';

export function useStartDate() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const startDate = getStartDateFromUseSearchParams(params);

  const handleStartDate = (value: StartDate) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('sd', String(value));
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
    newParams.set('sd', String(value));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { endDate, handleEndDate };
}

// To be implemented: useSelectedSpaces hook. TBD. 
