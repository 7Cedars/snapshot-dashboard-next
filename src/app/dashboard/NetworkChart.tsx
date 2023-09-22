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

const NetworkChart = ( ) => {
  const { selectedSpaces } = useSpaces()
  const { dateA, dateB } = useDateRange()
  const startDate = Math.min(dateA, dateB) 
  const endDate = Math.max(dateA, dateB) 

  const { cache }  = useApolloClient()
  const cachedProposals: Proposal[] = toProposals({
    proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
  })

  console.log({
    proposals: cachedProposals,
    selectedSpaces: selectedSpaces,
    startDate: startDate,
    endDate: endDate
  })

  const proposalSelection = toSelectedProposals({
    proposals: cachedProposals,
    selectedSpaces: selectedSpaces,
    startDate: startDate,
    endDate: endDate
  })

  const selectedProposals = proposalSelection.map(proposal => proposal.id)

  // better to make loop here.  
  const { error, data }: UseSuspenseQueryResult = useSuspenseQuery(VOTERS_ON_PROPOSALS, {
    variables: {
      first: 1000, 
      skip: 0, 
      proposal_in: selectedProposals}
  });

  if (error) return `Error! ${error}`;

  console.log("data2: ", data)

  //   }
  //   toNetworkGraph(selectedProposals)
  // }

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