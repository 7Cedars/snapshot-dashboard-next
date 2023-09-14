// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { SelectedSpaces, StartDate, EndDate } from "../../types" ;
import { parseSelectedSpaces, parseDateRange } from './parsers';
import { standardDateRange } from "../../../constants";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getDateRangeFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const dateRangeParam = params.getAll('date');
  let dateRange: [StartDate, EndDate] = [(Date.now() - standardDateRange), Date.now()];
  if (params.has('date') && dateRangeParam) {
    dateRange = parseDateRange(dateRangeParam);
  }
  return dateRange;
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
