import { Link, NetworkNode, Proposal, Status, Vote, NetworkLink } from "@/types";
import { useSpaces } from "./useUrl"
import { useVotes } from "./useVotes"
import { useEffect, useRef, useState } from "react";
import { fromVotesToRadius } from '@/app/utils/utils';
import { useProposals } from "./useProposals";
import { colourCodes } from "../../../constants";

export function useNetworkData() {
  const { selectedSpaces } = useSpaces() 
  const { selectedProposals, status: statusProposals  } = useProposals()
  const { selectedVotes, status: statusVotes } = useVotes()

  const [networkData, setNetworkData] = useState<{nodes: NetworkNode[], links: Link[]}>() 
  const status = useRef<Status>("isIdle")

  const getNetworkData = async () => { // votes: Vote[], proposals: Proposal[]
    status.current = "isLoading"
  
    if (selectedProposals && selectedVotes && statusVotes.current == "isSuccess" && statusProposals.current == "isSuccess") {
      try {
        let links: any[] = []
        let nodes: NetworkNode[] = []

        const uniqueVoters = Array.from(
          new Set(selectedVotes?.map(vote => vote.voter))
          )
        
        // building links
        // £todo The following is a very inefficient, would like to use reduce instead. 
        uniqueVoters.forEach(voter => {
          const voterVotes = selectedVotes?.filter(vote => vote.voter === voter)
          const voterSpaces = Array.from(
            new Set(voterVotes?.map(vote => vote.fullProposal?.space.id))
          )

          if (voterSpaces.length > 1) voterSpaces.forEach(
            voterSpaceSource => voterSpaces.forEach(
              voterSpaceTarget => {
                if (voterSpaceSource != voterSpaceTarget) {
                  const index = links.findIndex(link => link.source == voterSpaceSource && link.target == voterSpaceTarget) 
                  index != -1 ? links[index].value += 1 : links.push({source: voterSpaceSource, target: voterSpaceTarget, value: 1 })
                }
              }
            )
          )
        })
        
        // building nodes 
        const radia = fromVotesToRadius({votesWithProposal: selectedVotes , selectedSpaces: selectedSpaces, minRadius: 10, maxRadius: 40})
        // Note that it seems a bit convoluted to get DAO spaces from votes (instead of selectedSpaces directly) - but I wanted to make sure
        // that links and nodes were drawn from the same data source: selectedVotes. 
        const voterSpaces = Array.from(
          new Set(selectedVotes.map(vote => vote.fullProposal?.space.id))
        ).filter((space): space is string => !!space) // NB! typecasting. normally I do this in the parsers, but can also be done inline. 
        
        nodes = voterSpaces.map((space, i) => { 
          return ({
              id: space, 
              group: String(i), 
              radius: radia[i],
              colour: colourCodes[selectedSpaces.indexOf(space)]
          })
        })
        setNetworkData({ nodes: nodes, links: links })
        status.current = "isSuccess"
        
      } catch (error) {
        status.current = "isError"
        console.log(error) 
      } 
    } 
  }

  useEffect(() => {
    if (statusVotes.current == "isSuccess" && statusProposals.current == "isSuccess" && selectedVotes) getNetworkData() 
  }, [selectedVotes, statusVotes.current, statusProposals.current])

  // Notice: networkData will automatically update, but getNetworkData function can be used to force a reload. 
  return { getNetworkData, networkData, status };

}