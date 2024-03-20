import { 
  Proposal, 
  Vote, 
  NetworkNode
} from "../../types";

interface toHeatmapProps {
  proposals: Proposal[]; 
  start: number;
  end: number;
  nCol: number; 
} 

interface rangeProps {
  start: number; 
  end: number;
  nCol: number;
} 

interface HeatmapProps {
  x: string;
  y: string,
  value: number
}

interface IntersectionProps {
  startProposal: number;
  endProposal: number; 
  startRange: number; 
  endRange: number; 
}

interface VoteProposal extends Vote {
  fullProposal: Proposal | undefined;
}

export const toHeatmapData = ({proposals, start, end, nCol}: toHeatmapProps): HeatmapProps[] => {

  // £ack: adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  const range = ({start, end, nCol}: rangeProps ) =>
    Array.from({ length: nCol + 1 }, (_, i) => start + (i * ((end - start) / nCol) ));

  const spacesRange = range(
    {start, end, nCol }
    )
  const stepPerCol = (end - start) / nCol

  const spaces = Array.from( 
    new Set(proposals.map((proposal: any) => proposal.space.id))
    )

  const intersectionRangeProposal = ({startRange, endRange, startProposal, endProposal}: IntersectionProps): number => {
    if (startProposal > endRange || startRange > endProposal ) {return 0} 
    else {
      const intervalLength = Math.min(endRange, endProposal) - Math.max(startRange, startProposal) 
      const proposalLength = endProposal - startProposal

      return intervalLength / proposalLength
    }
  }

  // building basic data structure 
  const data: Array<HeatmapProps> = []  
  spaces.forEach(space => (
      spacesRange.map(number => {
        const newItem = 
        { x: String(number),
          y: space,
          value: 0
        }
        data.push(newItem)
      }) 
    ))

    // filling data structure. 
    proposals.forEach((proposal: any) => 
      data.forEach(point => {
         if (point.y ===  proposal.space.id) {
          point.value  = point.value + proposal.votes * intersectionRangeProposal(
            { startRange: parseInt(point.x),
              endRange: parseInt(point.x) + stepPerCol,
              startProposal: proposal.start * 1000,
              endProposal: proposal.end * 1000
            } 
          )
         }
      }) 
    )
  
  return data
}

export const toNetworkGraph = (votes: Vote[], proposals: Proposal[]) => {

  const uniqueSpaces = Array.from( 
    new Set(proposals.map((proposal: any) => proposal.space.id))
    )

  const voteProposal: VoteProposal[] = votes.map(vote => (
    {
    ...vote,
    fullProposal: proposals.find(proposal => proposal.id === vote.proposal.id)
    }
  ))

  const uniqueVoters = Array.from(
    new Set(votes.map(vote => vote.voter))
    )

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

  const nodes: NetworkNode[] = uniqueSpaces.map((space, i) => 
    ({id: space, group: "tbi"})
  )

  return {
    nodes: nodes, 
    links: links
  }
}

export default { toHeatmapData, toNetworkGraph }; 