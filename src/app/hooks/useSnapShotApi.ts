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

import { Link, NetworkNode, Proposal, SelectedSpaces, Status, Vote } from "@/types";
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
import { QueryClient } from '@tanstack/react-query'

interface VoteProposal extends Vote {
  fullProposal: Proposal | undefined;
}

type Data = { 
  cachedProposals?: Proposal[], 
  queryList?: string[][], 
  votes?: Vote[]; 
  network?: {
    nodes: NetworkNode[], 
    links: Link[]
  }
}

export function useSnapShotApi() {
  const { cache }  = useApolloClient()
  const { d1, d2 } = useDateRange() 
  const { selectedSpaces } = useSpaces() 
  const maxVotesProposal: number = 1000 // for now set as static. Can be a value later on.  

  const statusCachedProposal = useRef<Status>("isIdle") 
  const statusfFetchQueryList = useRef<Status>("isIdle")
  const statusfFetchVotes = useRef<Status>("isIdle")  
  const statusAtFilterVotes = useRef<Status>("isIdle")
  const statusAtgetNetworkData = useRef<Status>("isIdle")
  const d1Ref = useRef<number>(d1)
  const d2Ref = useRef<number>(d2) 
  const selectedSpacesRef = useRef<SelectedSpaces>(selectedSpaces)

  const [data, setData] = useState<Data>() 
  const fetchedVotes = useRef<any>() 
  
  const cachedProposals = useRef<Proposal[]>([]);
  const votesData = useRef<Vote[]>([]) 
  const [queryList, setQueryList] = useState<string[][]>() 
  // const resultQueries = useRef<any>()
  const [networkData, setNetworkData] = useState<{nodes: NetworkNode[], links: Link[]}>({nodes: [], links: []})

  const startDate = Math.min(d1, d2)  
  const endDate = Math.max(d1, d2)

  console.log({
    statusCachedProposal: statusCachedProposal.current, 
    statusfFetchQueryList: statusfFetchQueryList.current,
    statusfFetchVotes: statusfFetchVotes.current,
    statusAtFilterVotes: statusAtFilterVotes.current,
    statusAtgetNetworkData: statusAtgetNetworkData.current
  })

  console.log("data @useSnapshotApi: ", data)

  const fetchCachedProposals = () => {
    statusCachedProposal.current = "isLoading"

    try {
      const fetchedCachedProposals = toProposals({
        proposals: Object.values(cache.extract())
        .filter(item => item.__typename === "Proposal")
      })
      console.log("fetchedCachedProposals: ", fetchedCachedProposals)
      statusCachedProposal.current = "isSuccess"
      cachedProposals.current = fetchedCachedProposals 
      // setData({cachedProposals: fetchedCachedProposals})
    } catch (error) {
      statusCachedProposal.current = "isError"
      console.log(error)
    }
  }

  // creates a list of GraphQL queries to fetch voters on proposals from selected spaces during selected time period.. 
  const fetchQueryList = () => {
    statusfFetchQueryList.current = "isLoading"
    
    console.log("cachedProposals: ", cachedProposals) 
    console.log("selectedSpaces: ", selectedSpaces)

    // selecting cached proposals from which to fetch votes 
    let proposals: Proposal[] = toSelectedProposals({
      proposals: cachedProposals.current,
      selectedSpaces,
      startDate: Math.min(d1, d2),
      endDate: Math.max(d1, d2)
    })
    console.log("unfiltered proposals: ", proposals)
    proposals = proposals.filter(proposal => proposal.votes < maxVotesProposal)
    console.log("filtered proposals: ", proposals)
    
    // const votesFetched: Vote[] = votesData.current
    // const votesFetchedIds: string[] = votesFetched.length > 0 ?  
    //   Array.from(
    //     new Set(votesFetched.map(vote => vote.proposal.id)
    //     )
    //   ) : []

    // // only fetch votes for proposals that have not already been fetched. 
    // const votesToFetch = proposals.filter(
    //   (proposal) => votesFetchedIds.indexOf(proposal.id) === -1
    // )
    // if ( votesToFetch.length === 0 ) statusfFetchQueryList.current = "isSuccess"

    // console.log("votesToFetch: ", votesToFetch)

    // building array (queryList) used to fetch votes through useQueries hook. 
    // This can be more efficient, simpler, but for now will do. 
    let queryLists: string[][] = []
    let proposalsList: string[] = [] 
    let querySum = 0

    proposals.forEach(proposal => {
      if (querySum + proposal.votes < 1000 ) {
        proposalsList.push(proposal.id)
        querySum = querySum + proposal.votes
      } else {
        queryLists.push(proposalsList)
        proposalsList = [proposal.id]
        querySum = proposal.votes
      }
    })
    console.log("queryList: ", queryList)
    setQueryList(queryLists) 
    // setData({...data, queryList: queryLists})

    statusfFetchQueryList.current = "isSuccess"
  }

  // useEffect(() => {
    // Here actual fetching is done.
    // statusfFetchVotes.current = "isLoading"

    // £todo: can I set this in a try / catch logic? 
    const fetchVotesQuery = async (proposalList: string[]) => await request(
    apiProductionUrl, 
    VOTERS_ON_PROPOSALS, 
    {first: 1000, skip: 0, proposal_in: proposalList })

    const resultQueries = useQueries({
      queries: queryList ? queryList.map(proposalList => (
          {
            queryKey: ["votes", proposalList], 
            queryFn: () => fetchVotesQuery(proposalList), 
            staleTime: Infinity
          }
      )) 
      : [].map(proposalList => (
        {
          queryKey: ["votes", proposalList], 
          queryFn: () => fetchVotesQuery(proposalList)
        }
        ))
    })
    console.log("resultQueries: ", resultQueries)

    useEffect(() => {
      if (resultQueries && queryList ) { 
        if (resultQueries.length == queryList?.length && statusfFetchQueryList.current == "isSuccess") {
          statusfFetchVotes.current = "isSuccess"
          fetchedVotes.current = resultQueries
        }
      }
    }, [resultQueries ])

    
  // }, [ statusfFetchQueryList.current ])

  const filterVotes = () => {
    statusAtFilterVotes.current = "isLoading" 

    try { 
      fetchedVotes.current.forEach((result: any) => { 
        if (result.status === 'success') { 
          console.log("votes @fetchVotes: ", toVotes(result.data))
          votesData.current = [...votesData.current, ...toVotes(result.data)] 
          }
      })
    
      // filter votes on date range (because proposal might have run across begin and end date)
      const selectedProposals = cachedProposals.current.map(proposal => proposal.id)
      console.log("votesData.current before: ", votesData.current)
      votesData.current = votesData.current.filter(vote => 
        vote.created * 1000 > startDate && 
        vote.created * 1000 < endDate  && 
        selectedProposals.indexOf(vote.proposal.id) !== -1 
      )
      // setData({...data, votes: votesData.current})
      statusAtFilterVotes.current = "isSuccess"
      console.log("votesData.current after: ", votesData.current)
    } catch (error) {
      statusAtFilterVotes.current = "isError"
      console.log(error)
    }
    statusAtFilterVotes.current = "isSuccess"
  }

  const getNetworkData = async () => { // votes: Vote[], proposals: Proposal[]
    statusAtgetNetworkData.current = "isLoading"

    if (cachedProposals) {
      try {
        let links: any[] = []

        const selectedProposals = cachedProposals.current.filter(proposal => selectedSpaces.includes(proposal.space.id))
        console.log("selectedProposals: ", selectedProposals)

        const uniqueSpaces = Array.from( 
          new Set(selectedProposals.map((proposal: any) => proposal.space.id))
          )
        console.log("uniqueSpaces: ", uniqueSpaces)

        const voteProposal: VoteProposal[] = votesData.current.map(vote => ({
          ...vote,
          fullProposal: selectedProposals.find(proposal => proposal.id === vote.proposal.id)
          }))
        console.log("voteProposal: ", voteProposal)
        
        const uniqueVoters = Array.from(
          new Set(votesData.current.map(vote => vote.voter))
          )
        console.log("uniqueVoters: ", uniqueVoters)

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

        const nodes: NetworkNode[] = uniqueSpaces.map((space, i) => 
          ({id: space, group: String(i)})
        )

        statusAtgetNetworkData.current = "isSuccess"
        setData({...data, network: {
          nodes: nodes, 
          links: links
        }})
        setNetworkData({
          nodes: nodes, 
          links: links
        })
      } catch (error) {
        statusAtgetNetworkData.current = "isError"
        console.log(error)
      }
    }

  // To be implemented: 
  //  const uniqueLinks = links.reduce
  //  Link[] = Array.from(
  //     new Set(links)
  //     )
  //   uniqueLinks = uniqueLinks.map(link => {return ({...link, strength: .1})})
  //   console.log("links @transpose data: ", uniqueLinks)
  }

  const fetchData = () => {
    statusCachedProposal.current = "isIdle"
    statusfFetchQueryList.current = "isIdle"
    statusAtFilterVotes.current = "isIdle"
    statusAtgetNetworkData.current = "isIdle"

    fetchCachedProposals()
  }

  // data fetching sequencing. 
  useEffect(() => {
    if ( 
      statusCachedProposal.current === "isIdle" 
      ) fetchCachedProposals() 
    if ( 
      statusCachedProposal.current === "isSuccess" &&
      statusfFetchQueryList.current === "isIdle" &&
      cachedProposals && 
      d1 && d2 && selectedSpaces 
      ) fetchQueryList() 
    if ( 
      // statusfFetchQueryList.current === "isSuccess" && 
      statusfFetchVotes.current == "isSuccess" && 
      statusAtFilterVotes.current === "isIdle"   
      ) filterVotes()  
    if ( 
      statusAtFilterVotes.current === "isSuccess" && 
      statusAtgetNetworkData.current === "isIdle"
      ) getNetworkData() 

  }, [ , 
    statusCachedProposal.current, 
    statusfFetchQueryList.current, 
    statusfFetchVotes.current, 
    statusAtFilterVotes.current, 
    statusAtgetNetworkData.current 
    ])

  return { fetchData, votesData, networkData, statusAtgetNetworkData};
}