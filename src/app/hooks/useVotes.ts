// This is a refactoring of useVotes hook. 

// To be Implemented: 
// Proper error handling 
// proper state handing, useRef. 
// Fetching votes should be done automatically, not through calling a function. -- it should not take any props. 
// Output should be 
//  - networkData object (node, links, values - etc)
//  - heatmapData object (as a function that can be called for specific DAOs)  
//  - loading states (all seperate): FetchProposals, FetchVotes, TransposeNetworkData, TransposeHeatMapData 

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
  // console.log("status @useVotes: ", { 
  //   statusfFetchQueryList: statusfFetchQueryList,
  //   statusfFetchVotes: statusfFetchVotes,
  //   statusFilterVotes: statusFilterVotes
  // })

  const fetchedProposals = useRef<String[]>([]); 
  const fetchLists = useRef<string[][]>([]) 
  // console.log("refs @useVotes: ", { 
  //   fetchedProposals: fetchedProposals,
  //   fetchLists: fetchLists
  // })

  const allVotes = useRef<Vote[]> ([])  
  const selectedVotes = useRef<Vote[]> ([])  
  console.log("data @useVotes: ", {
    allVotes: allVotes, 
    selectedVotes: selectedVotes
  })

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

  // useEffect trigger with selectedProposal to update fetchLists 
  useEffect(() => {
    console.log("updateFetchlists triggered")
    if (selectedProposals) {
      const selectedProposalsIds = selectedProposals.map(proposal => proposal.id)
      const nonFetchedIds = selectedProposalsIds.filter(proposalId => fetchedProposals.current.indexOf(proposalId) == -1)
      console.log("nonFetchedIds: ", nonFetchedIds)

      if (
        nonFetchedIds && 
        statusfFetchQueryList.current != "isLoading" && 
        statusfFetchVotes.current != "isLoading"
        ) {
        console.log("fetchLists trigger POSITIVE")
        fetchQueryList() 
        }
      }
  }, [ selectedProposals ])

  // £todo: can I set this in a try / catch logic? 
  // Here actual fetching of votes happens. 
  const fetchVotesQuery = async (fetchList: string[]) => await request(
    apiProductionUrl, 
    VOTERS_ON_PROPOSALS, 
    {first: 1000, skip: 0, proposal_in: fetchList }
  )

  const resultQueries = useQueries({
    queries: fetchLists.current  ? fetchLists.current.map(fetchList => (
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
  console.log("resultQueries: ", resultQueries)

  // trigger to reload fetchlist. 
  useEffect(() => {
    console.log("reload FetchList triggered")

    if (resultQueries.filter(result => result.status == "loading").length > 0) statusfFetchVotes.current = "isLoading"
    if (resultQueries.filter(result => result.status != "loading").length == fetchLists.current.length) {

      resultQueries.forEach((result: any) => {
        // console.log("single item resultQueries at forEach: ", result)
        // console.log("votes @fetchVotes: ", ...toVotes(result.data))
        result.status === 'success' ? 
          allVotes.current = [...toVotes(result.data), ...allVotes.current]
          : 
          console.log("Error with fethcing votes: ", result)  
      })
      fetchedProposals.current = [...fetchedProposals.current, ...fetchLists.current.flat()]
      statusfFetchVotes.current = "isSuccess"
    }

  }, [ resultQueries ])


  const filterVotes = () => {
    statusFilterVotes.current = "isLoading" 

    if (selectedProposals && d1 && d2) {
      try { 
        // also filter votes on date range (because proposal might have run across begin or end of date range)
        const selectedProposalsId = selectedProposals.map(proposal => proposal.id)
        const startDate = Math.min(d1, d2)  
        const endDate = Math.max(d1, d2)

        selectedVotes.current = allVotes.current.filter(vote => 
          vote.created * 1000 > startDate && 
          vote.created * 1000 < endDate  && 
          selectedProposalsId.indexOf(vote.proposal.id) !== -1 
        )
      } catch (error) {
        statusFilterVotes.current = "isError"
        console.log(error)
      }
      statusFilterVotes.current = "isSuccess"
    }
  }
  
  // // Whenever  ref is updated, filter is triggered.  
  useEffect(() => {
    if ( statusfFetchVotes.current = "isSuccess") filterVotes()
  }, [selectedProposals, d1, d2 ])

  return { allVotes, selectedVotes }; 
}
