// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, SearchParams } from "../../types" ;
import { parseSelectedSpaces, parseDate } from './parsers';
import { standardDateRange } from "../../../constants";

export function getDateRangeFromUrlParams(
  searchParams: SearchParams
): {dateA: number, dateB: number} { 
  const dateAParam = searchParams.dateA;
  const dateBParam = searchParams.dateB;
  let dateA = (Date.now() - standardDateRange);
  let dateB = Date.now()
  if ('dateA' in searchParams && dateAParam && 'dateB' in searchParams && dateBParam) {
    dateA = parseDate(String(dateAParam));
    dateB = parseDate(String(dateBParam));
  }
  return{
    dateA: dateA,
    dateB: dateB
  }; ;
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