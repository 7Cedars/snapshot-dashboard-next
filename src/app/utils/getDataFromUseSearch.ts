// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces } from "../../types" ;
import { parseSelectedSpaces, parseDate } from './parsers';
import { standardDateRange } from "../../../constants";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getDateRangeFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const dateAParam = params.get('dateA');
  const dateBParam = params.get('dateB');
  let dateA = (Date.now() - standardDateRange);
  let dateB = Date.now()
  if (params.has('dateA') && params.has('dateB') && dateAParam && dateBParam) {
    dateA = parseDate(dateAParam);
    dateB = parseDate(dateBParam);
  }
  return {
    dateA: dateA,
    dateB: dateB
  };
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
