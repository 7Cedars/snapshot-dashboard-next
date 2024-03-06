import { Proposal, Node, Vote, Space } from "../../types";

interface ToSelectedProposalsProps {
  proposals: Proposal[], 
  selectedSpaces: string[], 
  startDate: number | null, 
  endDate: number | null 
  maxVotes?: number
}

interface VoteWithProposal extends Vote {
  fullProposal: Proposal | undefined;
}

type VotesToRadiusProps = {
  votesWithProposal: VoteWithProposal[]; 
  selectedSpaces: any[]; 
  minRadius: number;  
  maxRadius: number; 
}


const nameMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const toDateFormat = (timestamp: number): string => { 
  return new Date(timestamp).toISOString().split('T')[0]
}; 

export const toShortDateFormat = (timestamp: number): string => {
  const date = new Date(timestamp) 
  const shortYear = date.getFullYear().toString() // .slice(2,4) 

  return `${nameMonths[date.getMonth()]} ${shortYear}`
}; 

export const toFullDateFormat = (timestamp: number): string => {
  const date = new Date(timestamp) 
  return `${date.getDate()} ${nameMonths[date.getMonth()]} ${date.getFullYear()}`
}; 

export const toTimestamp = (dateFormat: string): string => { 
  return String(Date.parse(dateFormat))
};

export const toSelectedProposals = ( {proposals, selectedSpaces, startDate, endDate, maxVotes}: ToSelectedProposalsProps  ) => {
  // console.log("toSelectedProposals CALLED, proposals: ", proposals)

  const withinTimeRange = (timeStamp: number ): boolean => {
    if (startDate === null || endDate === null) { return true }  
    
    return startDate <= timeStamp*1000 && timeStamp*1000 <= endDate 
  }
  
  const amongSelectedSpaces = (spaceId: string): boolean => {
    return selectedSpaces.includes(spaceId)
  }

  const belowMaxVotes = (votes: number): boolean => {
    return maxVotes ? votes < maxVotes : true
  }

  const selectedProposals: Proposal[] = [] 
  proposals.map((proposal: Proposal) => {
      if (withinTimeRange(proposal.start) &&
          withinTimeRange(proposal.end) && 
          amongSelectedSpaces(proposal.space.id) && 
          belowMaxVotes(proposal.votes)) 
      { selectedProposals.push(proposal) }
    })
  
  // console.log("selectedProposals @toSelectedProposals: ", selectedProposals)

  return selectedProposals
}; 

export const fromVotesToRadius = ( { votesWithProposal, selectedSpaces, minRadius, maxRadius }: VotesToRadiusProps  ) => {
  console.log("fromVotesToRadius CALLED, proposals: ", {
    votesWithProposal: votesWithProposal,
    selectedSpaces: selectedSpaces, 
    minRadius: minRadius, 
    maxRadius: maxRadius
  })

  const numberVotes: number[] = selectedSpaces.map(space =>
    votesWithProposal.filter(vote => vote.fullProposal?.space.id === space).length
  )

  // Radius is defined by the minradius + log value multiplied by the range between minradius and maxradius. 
  const numberVotesWithoutZeros = numberVotes.filter(number => number != 0 )
  const minValue = Math.log10(Math.min(...numberVotesWithoutZeros))
  const maxValue = Math.log10(Math.max(...numberVotes))
  const valueRange = maxValue - minValue
  const radiusRange = maxRadius - minRadius
  const multiplier = radiusRange / valueRange 
  
  const radia = numberVotes.map(number => number == 0 ? minRadius : ((Math.log10(number) - minValue) * multiplier) + minRadius)
  return radia
}; 

export default { toDateFormat, toTimestamp, toSelectedProposals, fromVotesToRadius }; 