// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, StartDate, EndDate } from "../../types" ;
import { parseSelectedSpaces, parseStartDate, parseEndDate,  } from './parsers';
import { standardDateRange } from "../../../constants";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getStartDateFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const startDateParam = params.get('startDate');
  let startDate: StartDate = Date.now() - standardDateRange ;
  if (params.has('startDate') && startDateParam) {
    startDate = parseStartDate(startDateParam);
  }
  return startDate;
}

export function getEndDateFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const endDateParam = params.get('endDate');
  let endDate: EndDate = Date.now();
  if (params.has('endDate') && endDateParam) {
    endDate = parseEndDate(endDateParam);
  }
  return endDate;
}

export function getSpacesFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const spacesParam = params.getAll('space');
  let selectedSpaces: SelectedSpaces = [];
  if (params.has('space') && spacesParam) {
    selectedSpaces = parseSelectedSpaces(spacesParam);
  }
  return selectedSpaces;
}
