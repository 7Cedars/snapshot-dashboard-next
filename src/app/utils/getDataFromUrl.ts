// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, SearchParams } from "../../types" ;
import { parseSelectedSpaces, parseDate } from './parsers';
import { standardDateRange, genesisSnapshot } from "../../../constants";
import { Suspense } from 'react';

export function getDateRangeFromUrlParams(
  searchParams: SearchParams
): {d1: number, d2: number} { 
  const d1Param = searchParams.d1;
  const d2Param = searchParams.d2;
  let d1 = Date.now() - standardDateRange
  let d2 = Date.now()
  if ('d1' in searchParams && d1Param && 'd2' in searchParams && d2Param) {
    d1 = parseDate(String(d1Param));
    d2 = parseDate(String(d2Param));
  }
  return{
    d1: d1,
    d2: d2
  }; ;
}

export function getSpacesFromUseSearchParams(
  searchParams: SearchParams
): SelectedSpaces {
  const spacesParam = [searchParams.s].flat();
  let selectedSpaces: SelectedSpaces = [];
  if ('s' in searchParams && spacesParam) {
    selectedSpaces = parseSelectedSpaces(spacesParam);
  }
  return selectedSpaces;
}