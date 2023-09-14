"use client";

import { useLazyQuery } from '@apollo/client'
import { VOTERS_ON_PROPOSALS } from '../utils/queries'
import { SyntheticEvent, useEffect, useState } from 'react'; 
import { useAppSelector } from '../../redux/hooks';
import { Proposal } from '../../types';
import { useAppDispatch } from '../../redux/hooks';
import { addVotes } from '../../redux/reducers/proposalsReducer'
import { toNetworkGraph } from '../utils/transposeData';
import { toSelectedProposals } from '../utils/utils';
import { ChartCanvas } from '../ui/ChartCanvas';
import { NetworkDiagram } from './charts/NetworkDiagram';

const NetworkChart = ( ) => {

  const dispatch = useAppDispatch()
  const [ votersOnProposals ] = useLazyQuery(VOTERS_ON_PROPOSALS)
  // const {selectedSpaces, startDate, endDate} = useAppSelector(state => state.userInput)
  const { proposals } = useAppSelector(state => state.loadedProposals)
  const [selectedProposals, setSelectedProposals] = useState<Proposal[]>([])

  // useEffect(() => {
  //   const selectedProposals = toSelectedProposals({ 
  //     proposals,
  //     selectedSpaces, 
  //     startDate, 
  //     endDate
  //   })

  //   setSelectedProposals(selectedProposals)
    
  // }, [proposals, selectedSpaces, startDate, endDate ])

  // console.log("selectedProposals at network Graph: ", selectedProposals)

  // const loadedProposals = selectedProposals.filter(proposal => 
  //   proposal.votesLoaded === true
  // ) 
  // console.log("loadedProposals at network Graph: ", loadedProposals)

  const proposalsToLoad = selectedProposals.filter(proposal => 
    proposal.votesLoaded === false
  ) 
  console.log("proposalsToLoad at network Graph: ", proposalsToLoad)
  
  const handleDataOnClick = async (event: SyntheticEvent) => {
    event.preventDefault

    const proposalsToLoad = selectedProposals.filter(proposal => 
      proposal.votesLoaded === false
    )    
    const proposalsToLoadStr = proposalsToLoad.map(proposal => proposal.id)

    if (proposalsToLoadStr.length > 0) {
      try {
        let continueFetching = true;
        let skip = 0;
        while (continueFetching === true) {
      
          const { data } = await votersOnProposals({
            variables: { first: 1000, skip: skip, proposal_in: proposalsToLoadStr} 
          })

          console.log("FETCHED VOTES: ", data)
          console.log("LENGTH Fetched votes: ", data.votes.length)
          
          dispatch(addVotes(data.votes))

          if (data.votes.length !== 1000) { 
            continueFetching = false 
          } else {
            skip = skip + 1000
          } 
        }

      } catch (e) {
        console.log("ERROR: ", e)
      }
    }
    toNetworkGraph(selectedProposals)
  }

  return (
    <div className='content-center'> 
       <b> Network Component </b>
      <button 
        type="submit"
        className="font-medium text-black px-5 hover:text-gray-300 sm:py-6"
        onClick={handleDataOnClick}
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