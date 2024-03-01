import { Proposal, Node, Vote, Space } from "../../types";

interface Props {
  proposals: Proposal[], 
  selectedSpaces: string[], 
  startDate: number | null, 
  endDate: number | null 
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

export const toSelectedProposals = ( {proposals, selectedSpaces, startDate, endDate}: Props  ) => {
  console.log("toSelectedProposals CALLED, proposals: ", proposals)

  const withinTimeRange = (timeStamp: number ): boolean => {
    if (startDate === null || endDate === null) { return true }  
    
    return startDate <= timeStamp*1000 && timeStamp*1000 <= endDate 
  }
  
  const amongSelectedSpaces = (spaceId: string): boolean => {
    return selectedSpaces.includes(spaceId)
  }

  const selectedProposals: Proposal[] = [] 
  proposals.map((proposal: Proposal) => {
      if (withinTimeRange(proposal.start) &&
          withinTimeRange(proposal.end) && 
          amongSelectedSpaces(proposal.space.id) ) 
      { selectedProposals.push(proposal) }
    })
  
  console.log("selectedProposals @toSelectedProposals: ",selectedProposals)

  return selectedProposals
}; 

export default { toDateFormat, toTimestamp, toSelectedProposals }; 