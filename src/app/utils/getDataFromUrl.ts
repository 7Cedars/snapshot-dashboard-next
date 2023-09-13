// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, StartDate, EndDate, SearchParams } from "../../types" ;
import { parseSelectedSpaces, parseStartDate, parseEndDate,  } from './parsers';
import { standardDateRange } from "../../../constants";

export function getStartDateFromUrlParams(
  searchParams: SearchParams
): StartDate {
  const startDateParam = searchParams.startDate;
  let startDate: StartDate = Date.now() - standardDateRange ;
  if ('startDate' in searchParams && startDateParam) {
    startDate = parseStartDate(String(startDateParam));
  }
  return startDate;
}

export function getEndDateFromUrlParams(
  searchParams: SearchParams
): EndDate {
  const endDateParam = searchParams.endDate;
  let startDate: StartDate = Date.now();
  if ('endDate' in searchParams && endDateParam) {
    startDate = parseStartDate(String(endDateParam));
  }
  return startDate;
}

export function getSpacesFromUrlParams(
  searchParams: SearchParams
): SelectedSpaces {
  const spacesParam = searchParams.selectedSpaces;
  let selectedSpaces: SelectedSpaces = [];
  if ('spaces' in searchParams && spacesParam) {
    selectedSpaces = parseSelectedSpaces(spacesParam);
  }
  return selectedSpaces;
}

// Here still need function getSelectedSpaces... TBD