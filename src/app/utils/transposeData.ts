import { 
  Proposal, 
  Node, 
  Vote, 
  NetworkGraph, 
  NetworkLink, 
  NetworkNode, 
  Link 
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

interface withinRangeProps {
  proposalStart: number; 
  proposalStop: number;
  spacesRange: number[];
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

  // // console.log("toHeatmapData called")
  // adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
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
    // // console.log("intersectionRangeProposal: ",startRange, endRange, startProposal, endProposal)

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

    // console.log("basic data structure: ", data)

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

  //  // console.log('test: ', data)
  // filling in data points.
  // proposals.forEach((proposal: any) => {
  //   data.forEach(point => {
  //     if (point.y ===  proposal.space.__ref.replace("Space:", "")) {
  //       return point.value + proposal.votes * intersectionRangeProposal(
  //         { startRange: parseInt(point.x),
  //           endRange: parseInt(point.x) + stepPerCol,
  //           startProposal: proposal.start,
  //           endProposal: proposal.end
  //         } 
  //       )
  //     }
  //   })
  // })

  // console.log("DATA at Heatmap data: ", data)
  
  return data
}

// toNetworkGraph
export const toNetworkGraph = (votes: Vote[], proposals: Proposal[]) => {
  // console.log("toNetworkGraph called")

  const uniqueSpaces = Array.from( 
    new Set(proposals.map((proposal: any) => proposal.space.id))
    )

  const voteProposal: VoteProposal[] = votes.map(vote => (
    {
    ...vote,
    fullProposal: proposals.find(proposal => proposal.id === vote.proposal.id)
    }
  ))

  // console.log("voteProposal: ", voteProposal)

  const uniqueVoters = Array.from(
    new Set(votes.map(vote => vote.voter))
    )

  // console.log("uniqueVoters: ", uniqueVoters)

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

  // console.log("links: ", links)

//  const uniqueLinks = links.reduce
 
//  Link[] = Array.from(
//     new Set(links)
//     )
//   uniqueLinks = uniqueLinks.map(link => {return ({...link, strength: .1})})

//   // console.log("links @transpose data: ", uniqueLinks)

  const nodes: NetworkNode[] = uniqueSpaces.map((space, i) => 
    ({id: space, group: "tbi"})
  )

  return {
    nodes: nodes, 
    links: links
  }
}

export default { toHeatmapData, toNetworkGraph }; 