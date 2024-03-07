// This is a refactoring of useVotes hook. 

import { Proposal, Status, Vote } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import request from "graphql-request";
import { apiProductionUrl } from "../../../constants";

import { VOTERS_ON_PROPOSALS } from "../utils/queries";
import { useQueries } from "@tanstack/react-query";
import { useDateRange, useSpaces } from "./useUrl";
import { useProposals } from "./useProposals";
import { toVotes } from "../utils/parsers";


interface VoteWithProposal extends Vote {
  fullProposal?: Proposal | undefined;
}


export function useVotes() {
  const { d1, d2 } = useDateRange() 
  const { selectedProposals } = useProposals() 
  console.log("useProposal Data @useVotes: ", {
    // allProposals: allProposals, 
    selectedProposals: selectedProposals, 
    // status: status
  })

  const statusfFetchQueryList = useRef<Status>("isIdle")
  const statusfFetchVotes = useRef<Status>("isIdle")  
  const statusFilterVotes = useRef<Status>("isIdle")
  const status = useRef<Status>("isIdle")
  console.log("status @useVotes: ", { 
    statusfFetchQueryList: statusfFetchQueryList,
    statusfFetchVotes: statusfFetchVotes,
    statusFilterVotes: statusFilterVotes, 
    status: status
  })

  const fetchedProposals = useRef<String[]>([]); 
  const fetchLists = useRef<string[][]>([]) 
  const fetchedVotes = useRef<any[]>([]) 
  console.log("refs @useVotes: ", { 
    fetchedProposals: fetchedProposals,
    fetchLists: fetchLists, 
    fetchedVotes: fetchedVotes
  })

  const [fetchListState, setFetchListState] = useState<string[][]>() 
  const [allVotes, setAllVotes] = useState<Vote[]>() 
  const [selectedVotes, setSelectedVotes] = useState<VoteWithProposal[]>() 
  console.log("states @useVotes: ", { 
    fetchListState: fetchListState,
    allVotes: allVotes, 
    selectedVotes: selectedVotes
  })

  /////////////////// Creating Fetch Lists /////////////////////
  const fetchQueryList = () => {
    console.log("Fetchquery List triggered")
    statusfFetchQueryList.current = "isLoading"

    // only fetch votes for proposals that have not already been fetched. 
    const unfetchedProposals = selectedProposals?.filter(proposal => 
      fetchedProposals.current.indexOf(proposal.id) === -1
    )
    console.log("unfetchedProposals: ", unfetchedProposals)
    if ( unfetchedProposals?.length === 0 ) statusfFetchQueryList.current = "isSuccess"

    // building array (queryList) used to fetch votes through useQueries hook. 
    // This can be more efficient, simpler, but for now will do. 
    let queryLists: string[][] = []
    let proposalsList: string[] = [] 
    let querySum = 0

    unfetchedProposals?.forEach(proposal => {
      if (querySum + proposal.votes < 1000 ) {
        proposalsList.push(proposal.id)
        querySum = querySum + proposal.votes
      } else {
        queryLists.push(proposalsList)
        proposalsList = [proposal.id]
        querySum = proposal.votes
      }
    })

    statusfFetchQueryList.current = "isSuccess"
    fetchLists.current = queryLists   
  }

  /////////////////// Fetching Votes /////////////////////
  // £todo: can I set this in a try / catch logic? 
  const fetchVotesQuery = async (fetchList: string[]) => await request(
    apiProductionUrl, 
    VOTERS_ON_PROPOSALS, 
    {first: 1000, skip: 0, proposal_in: fetchList }
  )

  let fetchedVotes2 = useQueries({
    queries: fetchListState  ? fetchListState.map(fetchList => (
        {
          queryKey: ["votes", fetchList], 
          queryFn: () => fetchVotesQuery(fetchList), 
          staleTime: Infinity
        }
      )) 
      : [].map(fetchList => (
        {
          queryKey: ["votes", fetchList], 
          queryFn: () => fetchVotesQuery(fetchList)
        }
      ))
    })
  console.log("resultQueries: ", fetchedVotes2)

  // handling status of statusfFetchVotes
  // notice that status is simplified: only loading or success - errors are handled on one to one basis.  
  // useEffect(() => {
  //   if (fetchedVotes.current.filter(result => result.status == "loading").length > 0) {
  //     statusfFetchVotes.current = "isLoading"
  //   } else {
  //     let votes: Vote[] = []
  //     fetchedVotes2.forEach((result: any) => {
  //       result.status === 'success' ? 
  //         votes = [...toVotes(result.data), ...votes]
  //         : 
  //         console.log("Error with fethcing votes: ", result)  
  //     })
  //     console.log("votes @useVotes: ", votes )
  //     setAllVotes(votes) 
  //     statusfFetchVotes.current = "isSuccess"
  //     fetchedVotes2 = []
  //   }
  // }, [fetchedVotes.current, fetchLists.current])

  ////////////////// Filtering Votes /////////////////////
  const filterVotes = () => {
    statusFilterVotes.current = "isLoading" 
    
    let votes: Vote[] = []
    let votesWithProposal: VoteWithProposal[] = []

    if (selectedProposals && d1 && d2 && allVotes) {
      try { 
        // also filter votes on date range (because proposal might have run across begin or end of date range)
        const selectedProposalsId = selectedProposals.map(proposal => proposal.id)
        const startDate = Math.min(d1, d2)  
        const endDate = Math.max(d1, d2)

        votes = allVotes.filter(vote => 
          vote.created * 1000 > startDate && 
          vote.created * 1000 < endDate  && 
          selectedProposalsId.indexOf(vote.proposal.id) !== -1 
        )
        
        votesWithProposal = !votes ? [] : votes.map(vote => ({
          ...vote,
          fullProposal: selectedProposals?.find(proposal => proposal.id === vote.proposal.id)
          }))

      } catch (error) {
        statusFilterVotes.current = "isError"
        console.log(error)
      }
      statusFilterVotes.current = "isSuccess"
      setSelectedVotes(votesWithProposal)
    }
  }

  ////////////////// Sequencing Hook Data Flow & updating generic status hook /////////////////////
  // As useQueries triggers at any state change, sequence is changed by settign states, instead of calling functions. 
  useEffect(() => {
    console.log("hook sequence triggered")
    if (
      statusfFetchQueryList.current == "isSuccess" && 
      statusfFetchVotes.current == "isSuccess" && 
      statusFilterVotes.current == "isSuccess" 
      ) {
        statusfFetchQueryList.current = "isIdle" 
        statusfFetchVotes.current = "isIdle" 
        statusFilterVotes.current = "isIdle" 
      }

    if (
      selectedProposals && 
      statusfFetchQueryList.current != "isLoading"
      ) fetchQueryList() 
    if ( // this should trigger useQueries / fetchVotesQuery
      statusfFetchVotes.current != "isLoading" && 
      fetchLists.current.length > 0 
    ) {
      setFetchListState(fetchLists.current)
      fetchLists.current = []
    } 
    if (
      fetchedVotes2.filter(result => result.status == "loading").length > 0 && 
      statusfFetchVotes.current == "isSuccess"
      ) { 
        statusfFetchVotes.current = "isLoading"
      } else {
      let votes: Vote[] = []
      fetchedVotes2.forEach((result: any) => {
        result.status === 'success' ? 
          votes = [...toVotes(result.data), ...votes]
          : 
          console.log("Error with fethcing votes: ", result)  
      })
      console.log("votes @useVotes: ", votes )
      setAllVotes(votes) 
      statusfFetchVotes.current = "isSuccess"
      fetchedVotes2 = []
    }
    if ( 
      statusfFetchVotes.current == "isSuccess" && 
      allVotes  && 
      allVotes.length > 0 &&  
      statusFilterVotes.current != "isLoading" 
      ) {
        filterVotes()
      }
  }, [ 
    selectedProposals, 
    d1, 
    d2
  ]) 

  // updating generic status. 
  useEffect(() => {
    if (
      statusfFetchQueryList.current == "isSuccess" && 
      statusfFetchVotes.current == "isSuccess" && 
      statusFilterVotes.current == "isSuccess" 
      ) {
        status.current = "isSuccess"
      }
    if (
      statusfFetchQueryList.current == "isIdle" || 
      statusfFetchVotes.current == "isIdle" || 
      statusFilterVotes.current == "isIdle" 
      ) {
        status.current = "isIdle"
      }
    if (
      statusfFetchQueryList.current == "isLoading" || 
      statusfFetchVotes.current == "isLoading" || 
      statusFilterVotes.current == "isLoading" 
      ) {
        status.current = "isLoading"
      }

    if (
      statusfFetchQueryList.current == "isError" || 
      statusfFetchVotes.current == "isError" || 
      statusFilterVotes.current == "isError" 
      ) {
        status.current = "isError"
      }
  }, [
    allVotes, selectedVotes
  ])

  return { allVotes, selectedVotes, status }; 
}
