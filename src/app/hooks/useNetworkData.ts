import { Link, NetworkNode, Proposal, Status, Vote, NetworkLink } from "@/types";
import { useSpaces } from "./useUrl"
import { useVotes } from "./useVotes"
import { useEffect, useMemo, useRef, useState } from "react";
import { fromVotesToRadius } from '@/app/utils/utils';
import { useProposals } from "./useProposals";
import { colourCodes } from "../../../constants";


export function useNetworkData() {
  const { selectedSpaces } = useSpaces() 
  const { selectedProposals } = useProposals()
  const { selectedVotes, status } = useVotes()

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

    // if (votesWithProposal && selectedSpaces) {

    //   let links; 

    //   const votersPerSpace = selectedSpaces.map(space => 
    //     Array.from(
    //       new Set(
    //         votesWithProposal.map(vote => {if (vote.fullProposal && vote.fullProposal.space.id === space) return vote.voter })
    //       )
    //     )
    //   )
    //   console.log("votersPerSpace: ", votersPerSpace)
    //   votersPerSpace.forEach((sourceVoters, i) => 
    //     votersPerSpace.forEach((TargetVoters, j) => {
    //       console.log({
    //         sourceVoters: sourceVoters, 
    //         TargetVoters: TargetVoters
    //       })
    //     const filteredArray = sourceVoters.filter(voter => TargetVoters.includes(voter)).length;
    //     console.log("filteredArray: ", filteredArray)

    //     links.push({source: selectedSpaces[i], target: selectedSpaces[j], value: filteredArray ? filteredArray : 0 }) 
        
    //     })

    //   ) 
    //   console.log("links at reduce: ", links)    
    // } 

    

    if (selectedProposals && status.current == "isSuccess") {
      try {
        let links: any[] = []

        const uniqueVoters = Array.from(
          new Set(selectedVotes?.map(vote => vote.voter))
          )
        

        // console.log("uniqueVoters: ", uniqueVoters)

        // The following is a very inefficient, would like to use reduce instead. 
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
        console.log("links at loop: ", links)

        if (selectedVotes) {
          const radia = fromVotesToRadius({votesWithProposal: selectedVotes , selectedSpaces: selectedSpaces, minRadius: 10, maxRadius: 40})
      
          const nodes: NetworkNode[] = selectedSpaces.map((space, i) => { 
            return ({
                id: space, 
                group: String(i), 
                radius: radia[i],
                colour: colourCodes[selectedSpaces.indexOf(space)]
              })
            })
          statusAtgetNetworkData.current = "isSuccess"

          console.log("FINAL NETWORK DATA: ", {
            nodes: nodes, links: links
          })

          if (statusAtgetNetworkData.current == "isSuccess") networkData.current = { nodes: nodes, links: links }
        }  
      } catch (error) {
        statusAtgetNetworkData.current = "isError"
        console.log(error) 
      } 
    } 
  }

  useMemo(() => {
    console.log("getNetworkData triggered")
    if (selectedProposals && selectedVotes) {
      getNetworkData() 
    }
  }, [selectedProposals, selectedVotes])

  // Notice: networkData will automatically update, but getNetworkData function can be used to force a reload. 
  return { getNetworkData, networkData };

}