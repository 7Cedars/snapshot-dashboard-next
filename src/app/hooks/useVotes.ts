// This is a refactoring of useVotes hook. 

import { Proposal, Status, Vote } from "@/types";
import { useEffect, useRef, useState } from "react";
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
  const startDate = Math.min(d1, d2)  
  const endDate = Math.max(d1, d2)

  const { selectedSpaces } = useSpaces() 
  console.log("useSpaces Data @useVotes: ", {
    selectedSpaces: selectedSpaces, 
  })
  const { selectedProposals, status: statusProposals } = useProposals() 
  console.log("useProposal Data @useVotes: ", {
    selectedProposals: selectedProposals, 
  })

  const savedSelectedProposals = useRef<Proposal[]>([])
  const statusFetchQueryList = useRef<Status>("isIdle")
  const statusFetchVotes = useRef<Status>("isIdle")  
  const statusSetAllVotes = useRef<Status>("isIdle")  
  const statusSelectVotes = useRef<Status>("isIdle")
  const status = useRef<Status>("isIdle")
  console.log("status @useVotes: ", { 
    statusFetchQueryList: statusFetchQueryList,
    statusFetchVotes: statusFetchVotes,
    statusSetAllVotes: statusSetAllVotes, 
    statusSelectVotes: statusSelectVotes, 
    status: status
  })

  const fetchedProposals = useRef<String[]>([]); 
  const fetchLists = useRef<string[][]>(); 
  const runtimeSpaces = useRef<String[]>([]);
  const runtimeD1 = useRef<number>();   
  const runtimeD2 = useRef<number>();   

  // const fetchedVotes = useRef<any[]>([]) 
  console.log("refs @useVotes: ", { 
    fetchedProposals: fetchedProposals,
    fetchLists: fetchLists, 
    savedSelectedProposals: savedSelectedProposals
  })

  const [fetchListState, setFetchListState] = useState<string[][]>() 
  const [fetchedVotes, setFetchedVotes] = useState<any[]>() 
  const [allVotes, setAllVotes] = useState<Vote[]>([]) 
  const [selectionNeeded, setSelectionNeeded] = useState<boolean>(true)
  const [selectedVotes, setSelectedVotes] = useState<VoteWithProposal[]>([]) 
  console.log("states @useVotes: ", { 
    fetchListState: fetchListState,
    fetchedVotes: fetchedVotes, 
    allVotes: allVotes, 
    selectedVotes: selectedVotes
  })

  /////////////////// Creating Fetch Lists /////////////////////
  const fetchQueryList = () => {
    console.log("Fetchquery List triggered")
    statusFetchQueryList.current = "isLoading"

    // only fetch votes for proposals that have not already been fetched. 
    const unfetchedProposals = selectedProposals?.filter(proposal => 
      fetchedProposals.current.indexOf(proposal.id) === -1
    )
    console.log("unfetchedProposals: ", unfetchedProposals)
    if ( unfetchedProposals?.length === 0 ) statusFetchQueryList.current = "isSuccess"

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
    statusFetchQueryList.current = "isSuccess"
    fetchLists.current = queryLists   
  }

  /////////////////// Fetching Votes /////////////////////
  // £todo: can I set this in a try / catch logic? 
  const fetchVotesQuery = async (fetchList: string[]) => await request(
    apiProductionUrl, 
    VOTERS_ON_PROPOSALS, 
    {first: 1000, skip: 0, proposal_in: fetchList }
  )

  let fetchingQueries = useQueries({
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
  console.log("resultQueries: ", fetchingQueries)

  useEffect(() => {
    if (
      fetchingQueries.filter(query => query.isFetched === true).length === fetchListState?.length && 
      statusFetchVotes.current != "isSuccess"
    ) {
      setFetchedVotes(fetchingQueries)
      statusFetchVotes.current = "isSuccess"
    } 
    if (fetchingQueries.filter(query => query.isFetched === false).length > 0) {
      statusFetchVotes.current = "isLoading"
    } 
  }, [fetchingQueries])
  console.log("NB statusFetchVotes.current: ", statusFetchVotes.current)

  ////////////////// Filtering Votes /////////////////////
  // This is not properly triggered yet. 
  const selectVotes = () => {
    statusSelectVotes.current = "isLoading" 
    
    let votes: Vote[] = []
    let votesWithProposal: VoteWithProposal[] = []

    if (selectedProposals && d1 > 0 && d2 > 0 && allVotes) {
      try { 
        // also filter votes on date range (because proposal might have run across begin or end of date range)
        const selectedProposalsId = selectedProposals.map(proposal => proposal.id) 

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
        statusSelectVotes.current = "isError"
        console.log(error)
      }
      if (votesWithProposal) {
        statusSelectVotes.current = "isSuccess"
        runtimeSpaces.current = selectedSpaces
        runtimeD1.current = d1
        runtimeD2.current = d2
        setSelectedVotes(votesWithProposal)
      }
      votes = [] 
      votesWithProposal = []
    }
  }

  // hook that triggers updating selection votes. 
  useEffect(() => {
    if (
      selectedSpaces.length != runtimeSpaces.current.length || 
      d1 != runtimeD1.current || 
      d2 != runtimeD2.current 
      ) {
        setSelectionNeeded(true)
      }
    if (
      selectedSpaces.length == runtimeSpaces.current.length &&
      d1 == runtimeD1.current &&  
      d2 == runtimeD2.current 
      ) setSelectionNeeded(false)
  }, [ selectedSpaces, d1, d2 ])
  
  ////////////////// Sequencing Hook Data Flow & updating generic status hook /////////////////////
  // As useQueries triggers at any state change, sequence is changed by settign states, instead of calling functions. 
  useEffect(() => {
    console.log("hook sequence triggered")
    if (
      selectedProposals &&
      savedSelectedProposals.current && 
      selectedProposals.length != savedSelectedProposals.current.length 
      ) {
        console.log("fetchqueryist triggered")
        savedSelectedProposals.current = selectedProposals
        statusFetchQueryList.current = "isIdle"
        statusFetchVotes.current = "isIdle"
        statusSetAllVotes.current = "isIdle"
        statusSelectVotes.current = "isIdle"
        fetchQueryList()
      } 

    if ( // this should trigger useQueries / fetchVotesQuery - it does
      statusFetchVotes.current == "isIdle" && 
      statusFetchQueryList.current == "isSuccess" 
    ) {
      setFetchListState(fetchLists.current)
    } 
    if (
      fetchedVotes &&
      statusFetchVotes.current == "isSuccess" && 
      statusSetAllVotes.current == "isIdle"
      ) {
        console.log("statusFetchVotes TRIGGERED: 'SETTING ALLVOTES'")
        statusSetAllVotes.current = "isLoading"

        let votes: Vote[] = []
        fetchedVotes.forEach((result: any) => {
          result.status === 'success' ? 
            votes = [...toVotes(result.data), ...votes]
            : 
            console.log("Error with fethcing votes: ", result)  
        })
        statusSetAllVotes.current = "isSuccess"
        setAllVotes([...votes, ...allVotes])
      }
    if ( 
      allVotes && 
      selectionNeeded && 
      statusSetAllVotes.current == "isSuccess" && 
      statusSelectVotes.current != "isLoading"
      ) {
        statusSelectVotes.current = "isLoading"
        selectVotes()
      }
  }, [ 
    selectedProposals, 
    d1, 
    d2, 
    fetchingQueries, 
    fetchedVotes, 
    allVotes, 
    selectionNeeded
    // statusFetchVotes.current
    // fetchLists.current,
  ]) 

  // updating generic status. 
  useEffect(() => {
    if (
      statusFetchQueryList.current == "isSuccess" && 
      statusFetchVotes.current == "isSuccess" && 
      statusSelectVotes.current == "isSuccess" 
      ) {
        status.current = "isSuccess"
      }
    if (
      statusFetchQueryList.current == "isIdle" && 
      statusFetchVotes.current == "isIdle" && 
      statusSelectVotes.current == "isIdle" 
      ) {
        status.current = "isIdle"
      }
    if (
      statusFetchQueryList.current == "isLoading" || 
      statusFetchVotes.current == "isLoading" || 
      statusSelectVotes.current == "isLoading" 
      ) {
        status.current = "isLoading"
      }
    if (
      statusFetchQueryList.current == "isError" || 
      statusFetchVotes.current == "isError" || 
      statusSelectVotes.current == "isError" 
      ) {
        status.current = "isError"
      }
  }, [
    allVotes, selectedVotes
  ])

  return { allVotes, selectedVotes, status }; 
}
