// This is a refactoring of useVotes hook. 

// To be Implemented: 
// Proper error handling 
// proper state handing, useRef. 
// Fetching votes should be done automatically, not through calling a function. -- it should not take any props. 
// Output should be 
//  - networkData object (node, links, values - etc)
//  - heatmapData object (as a function that can be called for specific DAOs)  
//  - loading states (all seperate): FetchProposals, FetchVotes, TransposeNetworkData, TransposeHeatMapData 

// OLD: ///////////////////////////////////////////
// create a hook that takes a list of proposals, dateRange and boolean if props need to be filtered on length. 
// hook checks cache, calls graphQL API for missing votes. 
// state = fetchedProposals (previously checked proposals) 
// function = fetchProposals(proposals: Proposal[], dateRange [number, number], maxVotesProposal: boolean): votes: Vote[]

import { Proposal, Status, Vote } from "@/types";
import {  useEffect, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toProposals, toVotes } from "../utils/parsers";
import request from "graphql-request";
import { apiProductionUrl } from "../../../constants";

import { VOTERS_ON_PROPOSALS } from "../utils/queries";
import { toSelectedProposals } from "../utils/utils";
import { useQueries } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hooks";
import { useDateRange, useSpaces } from "./useUrl";

export function useVotes() {
  const dispatch = useAppDispatch()
  const { cache }  = useApolloClient()
  const [ queriesLength, setQueriesLength ] = useState<number>();

  const { d1, d2 } = useDateRange() 
  const { selectedSpaces } = useSpaces() 
  const maxVotesProposal: number = 1000 // for now set as static. Can be a value later on.  

  const statusCachedProposal = useRef<Status>("isIdle") 
  const statusAtFetchVotes = useRef<Status>("isIdle")
  const statusAtgetNetworkData = useRef<Status>("isIdle")
  
  const [ cachedProposals, setCachedProposals ] = useState<Proposal[]>();
  const apiData = useRef<Vote[]>([]) 
  const [votes, setVotes] = useState<Vote[]>([])

  const checkCachedProposals = () => {
    statusCachedProposal.current = "isLoading"

    try {
      const proposals = toProposals({
        proposals: Object.values(cache.extract())
        .filter(item => item.__typename === "Proposal")
      })
      statusCachedProposal.current = "isSuccess"
      setCachedProposals(proposals)
    } catch (error) {
      statusCachedProposal.current = "isError"
      console.log(error)
    }
  }

  const fetchVotes = () => {
    statusAtFetchVotes.current = "isPrepping"

    const startDate = Math.min(d1, d2)  
    const endDate = Math.max(d1, d2)
    
    // selecting cached proposals from which to fetch votes 
    let proposals: Proposal[] = toSelectedProposals({
      proposals: cachedProposals ? cachedProposals : [],
      selectedSpaces,
      startDate,
      endDate,
    })
    proposals = proposals.filter(proposal => proposal.votes < maxVotesProposal)
    
    const votesFetched: Vote[] = apiData.current
    const votesFetchedIds: string[] = votesFetched.length > 0 ?  
      Array.from(
        new Set(votesFetched.map(vote => vote.proposal.id)
        )
      ) : []

    // only fetch not already fetched. 
    const votesToFetch = proposals.filter(
      (proposal) => votesFetchedIds.indexOf(proposal.id) === -1
    )

    // building array (queryList) used to fetch votes through useQueries hook. 
    // This can be more efficient, simpler, but for now will do. 
    let queryList: string[][] = []
    let proposalsList: string[] = [] 
    let querySum = 0

    votesToFetch.forEach(proposal => {
      if (querySum + proposal.votes < maxVotesProposal ) {
        proposalsList.push(proposal.id)
        querySum = querySum + proposal.votes
      } else {
        queryList.push(proposalsList)
        proposalsList = [proposal.id]
        querySum = proposal.votes
      }
    })

    statusAtFetchVotes.current = "isFetching"
    // Here actual fetching takes place. 
    // see:  https://tanstack.com/query/v5/docs/react/reference/useQueries
    try { 
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
     
      queriesResult.forEach(result => { 
        if (result.status === 'success') { 
          const votesFetched: Vote[] = apiData.current
          apiData.current = [...votesFetched, ...toVotes(result.data)] 
          } 
      })

    } catch (error) {
      statusAtFetchVotes.current = "isError"
      console.log(error)
    }

    // filter votes on date range (because proposal might have run across begin and end date)
    const selectedProposals = proposals.map(proposal => proposal.id)
    apiData.current = apiData.current.filter(vote => 
      vote.created * 1000 > startDate && 
      vote.created * 1000 < endDate  && 
      selectedProposals.indexOf(vote.proposal.id) !== -1 
    )


    statusAtFetchVotes.current = "isSuccess"
    setVotes(apiData.current)
  }

  const getNetworkData = () => { // votes: Vote[], proposals: Proposal[]
    statusAtgetNetworkData.current = "isLoading"

    const uniqueSpaces = Array.from( 
      new Set(proposals.map((proposal: any) => proposal.space.id))
      )
  
    const voteProposal: VoteProposal[] = votes.map(vote => (
      {
      ...vote,
      fullProposal: proposals.find(proposal => proposal.id === vote.proposal.id)
      }
    ))
  
    console.log("voteProposal: ", voteProposal)
  
    const uniqueVoters = Array.from(
      new Set(votes.map(vote => vote.voter))
      )
  
    console.log("uniqueVoters: ", uniqueVoters)
  
    let links: any[] = []
    uniqueVoters.forEach(voter => {
      const voterVotes = voteProposal.filter(vote => vote.voter === voter)
      const voterSpaces = Array.from(
        new Set(voterVotes.map(vote => vote.fullProposal?.space.id))
      )
      if (voterSpaces.length > 1) voterSpaces.forEach(voterSpace => {
        if (voterSpace !== voterSpaces[0]) {
        links.push(
          { source: voterSpaces[0], target: voterSpace, value: 1 } 
         )
        }
      })
    })
  
    console.log("links: ", links)
  
  //  const uniqueLinks = links.reduce
   
  //  Link[] = Array.from(
  //     new Set(links)
  //     )
  //   uniqueLinks = uniqueLinks.map(link => {return ({...link, strength: .1})})
  
  //   console.log("links @transpose data: ", uniqueLinks)
  
    const nodes: NetworkNode[] = uniqueSpaces.map((space, i) => 
      ({id: space, group: "tbi"})
    )
  
    return {
      nodes: nodes, 
      links: links
    }
  }



  return { votes };
}