// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, StartDate, EndDate, SearchParams } from "../../types" ;
import { parseSelectedSpaces, parseDateRange } from './parsers';
import { standardDateRange } from "../../../constants";

export function getDateRangeFromUrlParams(
  searchParams: SearchParams
): [StartDate, EndDate] {
  const spacesParam = [searchParams.space].flat();
  let dateRange: [StartDate, EndDate] = [(Date.now() - standardDateRange), Date.now() ];
  if ('date' in searchParams && spacesParam) {
    dateRange = parseDateRange(spacesParam);
  }
  return dateRange;
}

export function getSpacesFromUrlParams(
  searchParams: SearchParams
): SelectedSpaces {
  const spacesParam = [searchParams.space].flat();
  let selectedSpaces: SelectedSpaces = [];
  if ('space' in searchParams && spacesParam) {
    selectedSpaces = parseSelectedSpaces(spacesParam);
  }
  return selectedSpaces;
}