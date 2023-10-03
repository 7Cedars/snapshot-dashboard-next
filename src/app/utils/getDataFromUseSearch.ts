// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces } from "../../types" ;
import { parseSelectedSpaces, parseDate } from './parsers';
import { standardDateRange } from "../../../constants";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getDateRangeFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const date1Param = params.get('d1');
  const date2Param = params.get('d2');
  let d1 = Date.now() - standardDateRange
  let d2 = Date.now()
  if (params.has('d1') && params.has('d2') && date1Param && date2Param) {
    d1 = parseDate(date1Param);
    d2 = parseDate(date2Param);
  }
  return {
    d1: d1,
    d2: d2
  };
}

export function getSpacesFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const spacesParam = params.getAll('s');
  let selectedSpaces: SelectedSpaces = [];
  if (params.has('s') && spacesParam) {
    selectedSpaces = parseSelectedSpaces(spacesParam);
  }
  return selectedSpaces;
}
