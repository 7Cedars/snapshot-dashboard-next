// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, StartDate, EndDate } from "../../types" ;
import { parseSelectedSpaces, parseStartDate, parseEndDate,  } from '../utils/parsers';
import { standardDateRange } from "../../../constants";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getStartDateFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const startDateParam = params.get('sd');
  let startDate: StartDate = Date.now() - standardDateRange ;
  if (params.has('sd') && startDateParam) {
    startDate = parseStartDate(startDateParam);
  }
  return startDate;
}

export function getEndDateFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const endDateParam = params.get('sd');
  let endDate: StartDate = Date.now() - standardDateRange ;
  if (params.has('sd') && endDateParam) {
    endDate = parseStartDate(endDateParam);
  }
  return endDate;
}

// Here still need function getSelectedSpaces... TBD