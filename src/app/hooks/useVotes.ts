// create a hook that takes a list of proposals, dateRange and boolean if props need to be filtered on length. 
// hook checks cache, calls graphQL API for missing votes. 
// state = fetchedProposals (previously checked proposals) 
// function = fetchProposals(proposals: Proposal[], dateRange [number, number], filterOutliers: boolean): votes: Vote[]

import { Proposal } from "@/types";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toProposals, toVotes } from "../utils/parsers";
import { useSuspenseQuery, UseSuspenseQueryResult } from "@apollo/client";
import { VOTERS_ON_PROPOSALS } from "../utils/queries";

export function useVotes() {
  const { cache }  = useApolloClient()

  const [proposalsFetched, setProposalsFetched] = useState(['']) 

  const fetchVotes = (
    proposals: Proposal[],
    filterOutliers: boolean) => {

      let selectedProposals = proposals

      if (filterOutliers === true) {
        selectedProposals = proposals.filter(proposal => proposal.votes < 1000)
      }

      const proposalsToQuery = selectedProposals.filter(
        proposal => proposalsFetched.indexOf(proposal.id) === -1
      )

      console.log("proposalsToQuery: ", proposalsToQuery)

      let queryList: string[][] = []
      let proposalsList: string[] = [] 
      let querySum = 0

      proposalsToQuery.forEach(proposal => {
        if (querySum + proposal.votes < 1000 ) {
          proposalsList.push(proposal.id)
          querySum = querySum + proposal.votes
        } else {
          queryList.push(proposalsList)
          proposalsList = [proposal.id]
          querySum = proposal.votes
        }
      })

      console.log("queryArray: ", queryList)

      queryList.forEach((query: string[]) => {
        const { error }: UseSuspenseQueryResult = useSuspenseQuery(VOTERS_ON_PROPOSALS, {
          variables: {
            first: 1000, 
            skip: 0, 
            proposal_in: query}
        });

        if (error) return `Error! ${error}`;

        setProposalsFetched([...proposalsFetched, ...query] ) 

      })

      return 

  } 

  return { fetchVotes, proposalsFetched };
}
