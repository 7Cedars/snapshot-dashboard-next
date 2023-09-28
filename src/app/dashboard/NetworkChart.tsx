"use client";

import { useLazyQuery } from '@apollo/client'
import { VOTERS_ON_PROPOSALS } from '../utils/queries'
import { SyntheticEvent, useEffect, useState } from 'react'; 
import { useAppSelector } from '../../redux/hooks';
import { Proposal } from '../../types';
import { useAppDispatch } from '../../redux/hooks';
import { useSuspenseQuery, UseSuspenseQueryResult } from '@apollo/client';
import { toNetworkGraph } from '../utils/transposeData';
import { toSelectedProposals } from '../utils/utils';
import { ChartCanvas } from '../ui/ChartCanvas';
import { NetworkDiagram } from './charts/NetworkDiagram';
import { useApolloClient } from '@apollo/client';
import { useSpaces, useDateRange } from '../hooks/useUrl';
import { toProposals } from '../utils/parsers';
import { votesOfProposalNotCached } from '../utils/checkCache';
import { useVotes } from '../hooks/useVotes';


const NetworkChart = ( ) => {
  const { selectedSpaces } = useSpaces()
  const { dateA, dateB } = useDateRange()
  const { fetchVotes } = useVotes() 

  const votes = fetchVotes(selectedSpaces, dateA, dateB, true)
  console.log("votes: ", votes)

  return (
    <div className='content-center'> 
       <b> Network Component </b>
      <button 
        type="submit"
        className="font-medium text-black px-5 hover:text-gray-300 sm:py-6"
        // onClick={handleDataOnClick}
        >
        LOAD DATA
      </button> 
      <div>  
        <ChartCanvas
          VizComponent={NetworkDiagram}
          vizName={"NetworkDiagram"}
          maxWidth={2000}
          height={300}
          />
    </div>
    </div>
  );
}

export default NetworkChart;