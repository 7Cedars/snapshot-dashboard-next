import { Link, NetworkNode, Proposal, Status, Vote, NetworkLink } from "@/types";
import { useSpaces } from "./useUrl"
import { useVotes } from "./useVotes"
import { useEffect, useMemo, useRef, useState } from "react";
import { fromVotesToRadius } from '@/app/utils/utils';
import { useProposals } from "./useProposals";

interface VoteWithProposal extends Vote {
  fullProposal: Proposal | undefined;
}

type BuildLinksProps = {
  links: NetworkLink[];
  voterSpace: String[];
}

export function useNetworkData() {
  const { selectedSpaces } = useSpaces() 
  const { selectedProposals } = useProposals()
  const { selectedVotes } = useVotes()

  console.log("incoming data from hooks: ", {
    selectedSpaces: selectedSpaces, 
    selectedProposals: selectedProposals, 
    selectedVotes: selectedVotes
  })

  const networkData = useRef<{nodes: NetworkNode[], links: Link[]}>() 
  const statusAtgetNetworkData = useRef<Status>("isIdle")

  console.log("networkData: ", networkData )

  const getNetworkData = async () => { // votes: Vote[], proposals: Proposal[]
    statusAtgetNetworkData.current = "isLoading"

    if (selectedProposals) {
      try {
        let links: any[] = []

        const votesWithProposal: VoteWithProposal[] = selectedVotes.current.map(vote => ({
          ...vote,
          fullProposal: selectedProposals.find(proposal => proposal.id === vote.proposal.id)
          }))
        console.log("votesWithProposal: ", votesWithProposal)
        
        const uniqueVoters = Array.from(
          new Set(selectedVotes.current.map(vote => vote.voter))
          )
        // console.log("uniqueVoters: ", uniqueVoters)

        // The following is a very inefficient, would like to use reduce instead. 
        uniqueVoters.forEach(voter => {
          const voterVotes = votesWithProposal.filter(vote => vote.voter === voter)
          const voterSpaces = Array.from(
            new Set(voterVotes.map(vote => vote.fullProposal?.space.id))
          )

          if (voterSpaces.length > 1) voterSpaces.forEach(
            voterSpaceSource => voterSpaces.forEach(
              voterSpaceTarget => {
                const index = links.findIndex(link => link.source == voterSpaceSource && link.target == voterSpaceTarget) 
                index != -1 ? links[index].value += 1 : links.push({source: voterSpaceSource, target: voterSpaceTarget, value: 1 })
              }
            )
          )
        })
        console.log("links at loop: ", links)

        const radia = fromVotesToRadius({votesWithProposal: votesWithProposal , selectedSpaces: selectedSpaces, minRadius: 10, maxRadius: 40})
        const nodes: NetworkNode[] = selectedSpaces.map((space, i) => { 
          return ({
              id: space, 
              group: String(i), 
              radius:radia[i]
            })
          })
        statusAtgetNetworkData.current = "isSuccess"

        console.log("FINAL NETWORK DATA: ", {
          nodes: nodes, links: links
        })
        
        networkData.current = { nodes: nodes, links: links }
      
      } catch (error) {
        statusAtgetNetworkData.current = "isError"
        console.log(error) 
      } 
    } 
  }

  useMemo(() => {
    console.log("getNetworkData triggered")
    if (selectedProposals && selectedVotes.current) {
      getNetworkData() 
    }
  }, [selectedProposals, selectedVotes.current])

  // Notice: networkData will automatically update, but getNetworkData function can be used to force a reload. 
  return { getNetworkData, networkData };

}