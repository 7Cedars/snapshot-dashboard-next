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
import { toSelectedProposals } from "../utils/utils";
import { useQueries } from "@tanstack/react-query";
import { useDateRange, useSpaces } from "./useUrl";
import { useProposals } from "./useProposals";
import { toVotes } from "../utils/parsers";

export function useVotes() {
  const { d1, d2 } = useDateRange() 
  const { allProposals, selectedProposals, status } = useProposals() 
  const { cache }  = useApolloClient()
  const maxVotesProposal: number = 1000 // for now set as static. Can be a value later on.  

  const statusfFetchQueryList = useRef<Status>("isIdle")
  const statusfFetchVotes = useRef<Status>("isIdle")  
  const statusFilterVotes = useRef<Status>("isIdle")

  const fetchedVotesIndex = useRef<number>(0)
  const votesData = useRef<Vote[]>([]) 
  const [fetchedVotesFrom, setFetchedVotesFrom] = useState<string[]>([]) 
  const fetchVotesFrom = useRef<string[][]>([]) 
  const [allVotes, setAllVotes] = useState<Vote[]>([]) 

  console.log("fetchVotesFrom: ", fetchVotesFrom)

  const startDate = Math.min(d1, d2)  
  const endDate = Math.max(d1, d2)

  const fetchQueryList = () => {
    statusfFetchQueryList.current = "isLoading"

    const filteredProposals = selectedProposals?.filter(proposal => proposal.votes < maxVotesProposal)
    console.log("filteredProposals: ", filteredProposals)
    console.log("allVotes: ", allVotes)

    // only fetch votes for proposals that have not already been fetched. 
    const unfetchedProposals = filteredProposals?.filter(proposal => 
      fetchedVotesFrom.indexOf(proposal.id) === -1
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
    fetchVotesFrom.current = queryLists   
  }

  // useEffect trigger with selectedProposal to update fetchVotesFrom 
  // useEffect(() => {
  //   if (selectedProposals) {
  //     const selectedProposalsIds = selectedProposals.map(proposal => proposal.id)
  //     const nonFetchedIds = selectedProposalsIds.filter(proposalId => fetchedVotesFrom.indexOf(proposalId) == -1)

  //     if (
  //       nonFetchedIds && 
  //       statusfFetchQueryList.current != "isLoading" && 
  //       statusfFetchVotes.current != "isLoading"
  //       ) {
  //       console.log("fetchVotesFrom trigger POSITIVE")
  //       statusfFetchVotes.current = "isLoading"
  //       fetchQueryList() 
  //       }
  //     }
  // }, [selectedProposals])


  // £todo: can I set this in a try / catch logic? 
  // Here actual fetching of votes happens. 
  // const fetchVotesQuery = async (fetchList: string[]) => await request(
  //   apiProductionUrl, 
  //   VOTERS_ON_PROPOSALS, 
  //   {first: 1000, skip: 0, proposal_in: fetchList }
  // )

  // const resultQueries = useQueries({
  //   queries: fetchVotesFrom.current  ? fetchVotesFrom.current.map(fetchList => (
  //       {
  //         queryKey: ["votes", fetchList], 
  //         queryFn: () => fetchVotesQuery(fetchList), 
  //         staleTime: Infinity
  //       }
  //     )) 
  //     : [].map(fetchList => (
  //       {
  //         queryKey: ["votes", fetchList], 
  //         queryFn: () => fetchVotesQuery(fetchList)
  //       }
  //     ))
  //   })
  // console.log("resultQueries: ", resultQueries)

  // trigger to reload fetchlist. 
  // useEffect(() => {
  //   console.log("reload FetchList triggered")
  //   if (resultQueries?.length == fetchVotesFrom.current?.length) {
  //     resultQueries.forEach((result: any) => {
  //         // console.log("votes @fetchVotes: ", toVotes(result.data))
  //         result.status === 'success' ? 
  //           setAllVotes([...allVotes, ...toVotes(result.data)]) 
  //           : 
  //           console.log("Error with fethcing votes: ", result)
  //         setFetchedVotesFrom([...fetchedVotesFrom, ...fetchVotesFrom.current.flat()])
  //         statusfFetchVotes.current = "isSuccess"
  //       })
  //   }
  // }, [resultQueries])



  ////////////////////////////////////////////////////////////////////

  // const filterVotes = () => {
  //   statusFilterVotes.current = "isLoading" 

  //   try { 
  //     fetchedVotes.current.forEach((result: any) => { 
  //       if (result.status === 'success') { 
  //         // console.log("votes @fetchVotes: ", toVotes(result.data))
  //         votesData.current = [...votesData.current, ...toVotes(result.data)] 
  //         }
  //     })
    
  //     // filter votes on date range (because proposal might have run across begin and end date)
  //     const selectedProposalsId = selectedProposals.map(proposal => proposal.id)
  //     // console.log("votesData.current before: ", votesData.current)
  //     votesData.current = votesData.current.filter(vote => 
  //       vote.created * 1000 > startDate && 
  //       vote.created * 1000 < endDate  && 
  //       selectedProposalsId.indexOf(vote.proposal.id) !== -1 
  //     )
  //     // setData({...data, votes: votesData.current})
  //     statusFilterVotes.current = "isSuccess"
  //     // console.log("votesData.current after: ", votesData.current)
  //   } catch (error) {
  //     statusFilterVotes.current = "isError"
  //     console.log(error)
  //   }
  //   statusFilterVotes.current = "isSuccess"
  // }

  // // an additional function to force fetch data. a redundancy. 
  // const forceFetchData = () => {
  //   statusfFetchQueryList.current = "isIdle"
  //   statusFilterVotes.current = "isIdle"
  //   fetchCachedProposals()
  // }
  
  // // Whenever date range or selection of DAO's is changed, the hook updates automatically.  
  // useEffect(() => {
  //   statusCachedProposal.current = "isIdle"
  //   statusfFetchQueryList.current = "isIdle"
  //   statusFilterVotes.current = "isIdle"
  //   fetchCachedProposals()
  // }, [d1, d2, selectedSpaces])

  // data fetching sequencing. 
  // useEffect(() => {
  //   if ( 
  //     statusfFetchQueryList.current === "isIdle" &&
  //     selectedProposals &&  
  //     d1 && d2 
  //     ) fetchQueryList() 
    // if ( 
    //   statusfFetchVotes.current == "isSuccess" && 
    //   statusFilterVotes.current === "isIdle"   
    //   ) filterVotes()
  // }, [ , 
  //   statusfFetchQueryList.current, 
  //   statusfFetchVotes.current, 
  //   statusFilterVotes.current, 
  //   ])

  return { }; // allVotes, selectedVotes, proposalsVotesFetched
}


  // creates a list of GraphQL queries to fetch voters on proposals from selected spaces during selected time period.. 
  // const fetchQueryList = () => {
  //   statusfFetchQueryList.current = "isLoading"

  //   if (selectedProposals) {
  //     const proposals = selectedProposals.filter(proposal => proposal.votes < maxVotesProposal)

  //     console.log("proposals @useVotes: ", proposals)
  //     const votesFetched: Vote[] = votesData.current
  //     console.log("votesData.current @useVotes: ", votesData.current)

  //     const votesFetchedIds: string[] = votesFetched.length > 0 ?  
  //       Array.from(
  //         new Set(votesFetched.map(vote => vote.proposal.id)
  //         )
  //       ) : []

  //        // only fetch votes for proposals that have not already been fetched. 
  //     const votesToFetch = proposals.filter(
  //       (proposal) => votesFetchedIds.indexOf(proposal.id) === -1
  //     )
  //     if ( votesToFetch.length === 0 ) statusfFetchQueryList.current = "isSuccess"

  //     console.log("votesToFetch: ", votesToFetch)

  //     // building array (queryList) used to fetch votes through useQueries hook. 
  //     // This can be more efficient, simpler, but for now will do. 
  //     let queryLists: string[][] = []
  //     let proposalsList: string[] = [] 
  //     let querySum = 0

  //     proposals.forEach(proposal => {
  //       if (querySum + proposal.votes < 1000 ) {
  //         proposalsList.push(proposal.id)
  //         querySum = querySum + proposal.votes
  //       } else {
  //         queryLists.push(proposalsList)
  //         proposalsList = [proposal.id]
  //         querySum = proposal.votes
  //       }
  //     })
  //     setQueryList(queryLists) 
  //     statusfFetchQueryList.current = "isSuccess"
  //   }
  // }