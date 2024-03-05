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
  const [fetchVotesFrom, setFetchVotesFrom] = useState<string[]>([]) 

  const startDate = Math.min(d1, d2)  
  const endDate = Math.max(d1, d2)

  const { loading, error, data} = useQuery(
    VOTERS_ON_PROPOSALS, 
    { variables: 
      { 
        first: 1000, 
        skip: 0, 
        proposal_in: [
          "0x48fcd4a240c501616aad34609083af3685a33b306c6b84c7a5f31cd580b98c90", 
          "0x87448bea7e8f6d5ac08e4f522e41785f5504cd3eafb2ea5ddddc6710415da046"
        ] // fetchVotesFrom
      },
      onError: (error) => console.log("Error @useQuery: ", error) 
    }
  );
  // const cachedQueries = Object.values(cache.extract()).filter(item => item.__typename === "Query")
  // const cachedVotes = cachedQueries ? Object.values(cachedQueries[0]) : []

  // console.log("cachedVotes: ", cachedVotes)

  console.log("fetchVotesFrom: ", fetchVotesFrom)
  console.log("data @useVotes: ", {
    data: data
  })

  console.log("selectedProposals @useVotes: ", selectedProposals )

  console.log("status @useVotes: ", {
    statusfFetchQueryList: statusfFetchQueryList,
    statusfFetchVotes: statusfFetchVotes, 
    statusFilterVotes: statusFilterVotes, 
    loading: loading
  })
  
  console.log("fetchVotesFrom: ", fetchVotesFrom)
  console.log("fetchedVotesIndex.current: ", fetchedVotesIndex.current)

  // useEffect(() => {
  //   statusfFetchQueryList.current = "isLoading"
  //   console.log("useEffect to create query list triggered")

  //   let querySum = 0
  //   let queryList: string[] = []
    
  //   if (
  //     selectedProposals && 
  //     selectedProposals.length > 0 && 
  //     !loading && 
  //     !error
  //     ) {    
  //       const filteredProposals: Proposal[] = selectedProposals.filter(proposal => proposal.votes < maxVotesProposal)
  //       const nonfetchedProposals: Proposal[] = filteredProposals.filter(proposal => fetchedVotesFrom.indexOf(proposal.id) == -1)
  //       const fetchList = nonfetchedProposals.map(proposal => proposal.id)
        
  //       setFetchVotesFrom(fetchList)

        // nonfetchedProposals.forEach(proposal => {
        //   if (querySum + proposal.votes < 1000) {
        //     queryList.push(proposal.id)
        //     querySum = querySum + proposal.votes
        //     console.log("queryList: ", queryList) 
        //     console.log("querySum: ", querySum) 
        //   } else {
        //     // console.log("conditional for setting fetchVotesFrom triggered1. queryList: ", queryList) 
        //     setFetchVotesFrom(queryList)
        //     setFetchedVotesFrom([...fetchedVotesFrom, ...queryList])
        //     querySum = 0
        //     queryList = []
        //     statusfFetchQueryList.current = "isSuccess"
        //   }
        //   if (queryList.length === filteredProposals.length) {
        //     // console.log("conditional for setting fetchVotesFrom triggered2. queryList: ", queryList) 
        //     setFetchVotesFrom(queryList)
        //     setFetchedVotesFrom([...fetchedVotesFrom, ...queryList]) // note that it is trcky to set this before successful loading - but for now will do. 
        //     querySum = 0
        //     queryList = []
        //     statusfFetchQueryList.current = "isSuccess"
        //   }
        // })
  //   }
  // }, [ selectedProposals, loading, error ])

  // useEffect(() => {
  //   if (
  //     voterData && 
  //     !error 
  //   ) fetchedVotesIndex.current = fetchedVotesIndex.current + 1
  // }, [ voterData ])

  // £todo: can I set this in a try / catch logic? 
  // const fetchVotesQuery = async (proposalList: string[]) => await request(
  //   apiProductionUrl, 
  //   VOTERS_ON_PROPOSALS, 
  //   {first: 1000, skip: 0, proposal_in: proposalList }
  // )

  // const resultQueries = useQueries({
  //   queries: queryList ? queryList.map(proposalList => (
  //       {
  //         queryKey: ["votes", proposalList], 
  //         queryFn: () => fetchVotesQuery(proposalList), 
  //         staleTime: Infinity
  //       }
  //   )) 
  //   : [].map(proposalList => (
  //     {
  //       queryKey: ["votes", proposalList], 
  //       queryFn: () => fetchVotesQuery(proposalList)
  //     }
  //   ))
  // })
  // // console.log("resultQueries: ", resultQueries)

  // useEffect(() => {
  //   if (resultQueries && queryList ) { 
  //     if (resultQueries.length == queryList?.length && statusfFetchQueryList.current == "isSuccess") {
  //       statusfFetchVotes.current = "isSuccess"
  //       fetchedVotes.current = resultQueries
  //     }
  //   }
  // }, [resultQueries ])

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