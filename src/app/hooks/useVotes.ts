// create a hook that takes a list of proposals, dateRange and boolean if props need to be filtered on length. 
// hook checks cache, calls graphQL API for missing votes. 
// state = fetchedProposals (previously checked proposals) 
// function = fetchProposals(proposals: Proposal[], dateRange [number, number], filterOutliers: boolean): votes: Vote[]

import { Proposal, Vote } from "@/types";
import {  useEffect, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toProposals, toVotes } from "../utils/parsers";
import request from "graphql-request";
import { apiProductionUrl } from "../../../constants";

import { VOTERS_ON_PROPOSALS } from "../utils/queries";
import { toSelectedProposals } from "../utils/utils";
import { useQueries } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hooks";
import { notification } from "@/redux/reducers/notificationReducer";

export function useVotes() {
  const { cache }  = useApolloClient()
  const [queriesLength, setQueriesLength] = useState<number>();
  const votesDataRef = useRef<Vote[]>([]) 
  const dispatch = useAppDispatch() 

  const cachedProposals = toProposals({
    proposals: Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")
  })

  const fetchVotes = (

    selectedSpaces: string[], 
    dateA: number, 
    dateB: number, 
    filterOutliers: boolean) => {

      const startDate = Math.min(dateA, dateB)  
      const endDate = Math.max(dateA, dateB)
    
      // selecting cached proposals from which to fetch votes 
      let proposals: Proposal[] = toSelectedProposals({
        proposals: cachedProposals,
        selectedSpaces,
        startDate,
        endDate,
      })

      // for now, only proposals with fewer than 1000 votes are fetched. 
      if (filterOutliers === true) {
        proposals = proposals.filter(proposal => proposal.votes < 1000)
      }
      
      // const votesFetched: string[] = [] 
      const votesFetched: Vote[] = votesDataRef.current
      const votesFetchedIds: string[] = votesFetched.length > 0 ?  
        Array.from(
          new Set(votesFetched.map(vote => vote.proposal.id)
          )
        ) : []

        // console.log("votesFetchedIds: ", votesFetchedIds)

      // only fetch not already fetched. 
      const votesToFetch = proposals.filter(
        (proposal) => votesFetchedIds.indexOf(proposal.id) === -1
      )

      // console.log("votesToFetch: ", votesToFetch)

      // building array (queryList) used to fetch votes through useQueries hook. 
      // This can be more efficient, simpler, but for now will do. 
      let queryList: string[][] = []
      let proposalsList: string[] = [] 
      let querySum = 0

      votesToFetch.forEach(proposal => {
        if (querySum + proposal.votes < 1000 ) {
          proposalsList.push(proposal.id)
          querySum = querySum + proposal.votes
        } else {
          queryList.push(proposalsList)
          proposalsList = [proposal.id]
          querySum = proposal.votes
        }
      })
      // console.log("queryList: ", queryList)

      // Here actual fetching takes place. 
      // see:  https://tanstack.com/query/v5/docs/react/reference/useQueries
      const fetchVotesQuery = async (proposalList: string[]) => await request(
        apiProductionUrl, 
        VOTERS_ON_PROPOSALS, 
        {first: 1000, skip: 0, proposal_in: proposalList })

      const queriesResult = useQueries({
        queries: queryList.map(proposalList => (
            {
              queryKey: ["votes", proposalList], 
              queryFn: () => fetchVotesQuery(proposalList)
            }
        ))
      })

      useEffect(() => {
        if (queriesResult) { 
          setQueriesLength(queriesResult.length)
        } else {
          setQueriesLength(0)
        }
      }, [, queriesResult])

      // console.log("queriesResult: ", queriesResult)
     
      queriesResult.forEach(result => { 
        if (result.status === 'success') { 
          const votesFetched: Vote[] = votesDataRef.current
          votesDataRef.current = [...votesFetched, ...toVotes(result.data)] 
          } 
      })

      const selectedProposals = proposals.map(proposal => proposal.id)

      votesDataRef.current = votesDataRef.current.filter(vote => 
        vote.created * 1000  > startDate && 
        vote.created * 1000 < endDate  && 
        selectedProposals.indexOf(vote.proposal.id) !== -1 
      )

      console.log("votesDataRef.current: ", votesDataRef.current, "votesToFetch: ",votesToFetch)

      return votesDataRef.current
  }

  return { fetchVotes, votesDataRef, queriesLength };
}
