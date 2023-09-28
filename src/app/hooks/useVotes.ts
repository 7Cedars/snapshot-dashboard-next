// create a hook that takes a list of proposals, dateRange and boolean if props need to be filtered on length. 
// hook checks cache, calls graphQL API for missing votes. 
// state = fetchedProposals (previously checked proposals) 
// function = fetchProposals(proposals: Proposal[], dateRange [number, number], filterOutliers: boolean): votes: Vote[]

import { Proposal, Vote } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import { toProposals, toVotes } from "../utils/parsers";
import { useSuspenseQuery, UseSuspenseQueryResult } from "@apollo/client";

import { VOTERS_ON_PROPOSALS } from "../utils/queries";
import { toSelectedProposals } from "../utils/utils";
import { useQueries } from "@tanstack/react-query";

export function useVotes() {
  const { cache }  = useApolloClient()
  const [votesFetchedFrom, setVotesFetchedFrom] = useState(['']) 
  const [status, setStatus] = useState('inactive') 
  const [votesData, setVotesData] = useState<Vote[]>([]) 

  const cachedProposals = toProposals({
    proposals: Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")
  })

  const cachedQueries = Object.values(cache.extract())
      .filter(item => item.__typename === 'Query')[0]
  const cachedQueriesFlat = (Array.from(Object.values(cachedQueries)))
    .flat()
    .filter((item: any) => item.__typename === 'Vote' )

  const cachedVotes: Vote[] = toVotes({votes: cachedQueriesFlat})
  console.log("cachedVotes: ", cachedVotes)

  const fetchVotes = (

    selectedSpaces: string[], 
    dateA: number, 
    dateB: number, 
    filterOutliers: boolean) => {

      const startDate = Math.min(dateA, dateB)  
      const endDate = Math.max(dateA, dateB)  
    
      let proposals: Proposal[] = toSelectedProposals({
        proposals: cachedProposals,
        selectedSpaces,
        startDate,
        endDate,
      })

      console.log("toSelectedProposals: ", proposals)

      if (filterOutliers === true) {
        proposals = proposals.filter(proposal => proposal.votes < 1000)
      }

      console.log("filterOutliers: ", proposals.filter(proposal => proposal.votes >= 1000))

      const votesToFetch = proposals.filter(
        proposal => votesFetchedFrom.indexOf(proposal.id) === -1
      )

      console.log("votesToFetch: ", votesToFetch)

      let queryList: string[][] = []
      let proposalsList: string[] = [] 
      let querySum = 0

      votesToFetch.forEach(proposal => {
        if (querySum + proposal.votes < 1000 ) {
          proposalsList.push(proposal.id)
          querySum = querySum + proposal.votes
        } else {
          queryList.push(proposalsList)
          console.log("proposalsList: ", proposalsList)
          proposalsList = [proposal.id]
          querySum = proposal.votes
        }
      })

      console.log("queryList: ", queryList)

      ///////////////////////////

      const defaultQueryFn = async ({ queryKey }: any) => {
        const { error, data }: UseSuspenseQueryResult = useSuspenseQuery(VOTERS_ON_PROPOSALS, {
            variables: {
              first: 1000, 
              proposal_in: queryKey}
          });
        return { error, data } 
      }

      const results = useQueries({
        queries: [
          { queryKey: ["0xf1fa3db021ee087d7158a12ad8b99f26fd15479773e0c9649fd4be900d93e745"], queryFn: defaultQueryFn },
          { queryKey: ["0x01a80a876f693c2088ade1286255871745cb6b66c66b4149f154676294d73100", "0x581f18bb13fd150876b7a90942c6cc2f2d974806c491586c9ef8c5467b80c3be"], queryFn: defaultQueryFn }
        ]
      })

      console.log("RESULTS: ", results)
      
///////////////////////////

        // const { error, data }: UseSuspenseQueryResult = useSuspenseQuery(VOTERS_ON_PROPOSALS, {
        //   variables: {
        //     first: 1000, 
        //     skip: 0, 
        //     proposal_in: query}
        // });

        // if (error) return `Error! ${error}`;
        // console.log("test: ", test)
        
        // const newVotesData: Vote[] = toVotes(data)
        // setVotesFetchedFrom([...votesFetchedFrom, ...query] ) 
        // setVotesData([...newVotesData, ...votesData])
      // })

      // Still have to filter votes by Date - that is for later. 
      // first get this to be more stable.. 

      // return [...votesData, ...cachedVotes] 

  } 

  return { fetchVotes, votesFetchedFrom };
}
