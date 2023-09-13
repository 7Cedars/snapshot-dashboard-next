import { SearchParams } from '../../types';
import { 
  getStartDateFromUrlParams, 
  getEndDateFromUrlParams } from '../utils/getDataFromUrl';

  
type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const startDate = getStartDateFromUrlParams(searchParams);
  const endDate = getEndDateFromUrlParams(searchParams);

  return (
    <>
      <ListControlesButtons />
      <List sortOrder={sortOrder} />
    </>
  );
}
