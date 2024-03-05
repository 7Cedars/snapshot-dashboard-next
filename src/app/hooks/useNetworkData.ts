import { Link, NetworkNode, Proposal, Status, Vote, NetworkLink } from "@/types";
import { useSpaces } from "./useUrl"
import { useVotes } from "./useVotes"
import { useEffect, useRef, useState } from "react";
import { fromVotesToRadius } from '@/app/utils/utils';

interface VoteWithProposal extends Vote {
  fullProposal: Proposal | undefined;
}

type BuildLinksProps = {
  links: NetworkLink[];
  voterSpace: String[];
}

export function useNetworkData() {
  const { selectedSpaces } = useSpaces() 
  const { forceFetchData, votesData, cachedProposals} = useVotes()
  const [ networkData, setNetworkData ] = useState<{nodes: NetworkNode[], links: Link[]}>() 
  const statusAtgetNetworkData = useRef<Status>("isIdle")

  console.log("votesData: ", votesData )
  console.log("networkData: ", networkData )

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

        const votesWithProposal: VoteWithProposal[] = votesData.current.map(vote => ({
          ...vote,
          fullProposal: selectedProposals.find(proposal => proposal.id === vote.proposal.id)
          }))
        console.log("votesWithProposal: ", votesWithProposal)
        
        const uniqueVoters = Array.from(
          new Set(votesData.current.map(vote => vote.voter))
          )
        console.log("uniqueVoters: ", uniqueVoters)

        uniqueVoters.forEach(voter => {
          const voterVotes = votesWithProposal.filter(vote => vote.voter === voter)
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

        ////// EDITING HERE //////
      
        let networkLinks: NetworkLink[] = []; // { source: "", target: "", value: 0 }

        uniqueVoters.forEach(voter => {
          const voterVotes = votesWithProposal.filter(
            vote => vote.voter === voter
            )
          const voterSpaces = Array.from(
            new Set(voterVotes.map(vote => vote.fullProposal?.space.id))
            )

          if (voterSpaces.length > 1) voterSpaces.forEach(voterSpaceSource => {
            voterSpaces.forEach(voterSpaceTarget => {
              let selectedNetworkLink = networkLinks.filter(networkLink => 
                networkLink.source === voterSpaceSource && 
                networkLink.target === voterSpaceTarget 
                )[0]
                
              selectedNetworkLink ? 
                selectedNetworkLink = {...selectedNetworkLink, value: selectedNetworkLink.value + 1 }
              :
              !selectedNetworkLink && voterSpaceSource && voterSpaceTarget ? 
                selectedNetworkLink = {source: voterSpaceSource, target: voterSpaceTarget, value: 1 } 
              : 
              null 
            })
          })
        })

        console.log("networkLinks: ", networkLinks)

        ////// EDITING HERE //////

        const radia = fromVotesToRadius({votesWithProposal: votesWithProposal , selectedSpaces: uniqueSpaces, minRadius: 10, maxRadius: 20})
        const nodes: NetworkNode[] = uniqueSpaces.map((space, i) => { 
          return ({
              id: space, 
              group: String(i), 
              radius:radia[i]
            })
          })
        statusAtgetNetworkData.current = "isSuccess"
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

  useEffect(() => {
    if (cachedProposals && votesData) {
      getNetworkData() 
    }
  }, [cachedProposals, votesData])

  // Notice: networkData will automatically update, but getNetworkData function can be used to force a reload. 
  return { getNetworkData, networkData };

}