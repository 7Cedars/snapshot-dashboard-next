import { Proposal, Node, Vote, NetworkGraph, NetworkLink, NetworkNode } from "../../types";

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

export const toHeatmapData = ({proposals, start, end, nCol}: toHeatmapProps): HeatmapProps[] => {

  // console.log("toHeatmapData called")
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

    // console.log("intersectionRangeProposal: ",startRange, endRange, startProposal, endProposal)

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

    // console.log("DATA: ", data)

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

  //  console.log('test: ', data)
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
export const toNetworkGraph = (votes: Vote[]) => {

  // console.log("proposals at toNetworkGraph: ", proposals)

  const hasSharedVoters = (spaceSource: Array<string>, spaceTarget: Array<string>) => {
    return spaceSource.some((item: string) => spaceTarget.includes(item))
  }

  const spaces = Array.from(
    new Set(proposals.map(proposal => proposal.space.id))
  )

  // const uniqueVotesSpace = new Set(
  //     proposals.map(proposal => 
  //       proposal.votesDetails.map(vote => 
  //         `${vote.voter};${proposal.space.id}`)
  //     ).flat()
  // )

  // const uniqueVotesSpaceArray = Array.from(uniqueVotesSpace).map(string => 
  //   string.split(";")[0]
  //   ).flat()

  // const votersInMultipleSpaces =  uniqueVotesSpaceArray.filter(
  //   (item, index) => uniqueVotesSpaceArray.indexOf(item) !== index
  //   ) 

  const assessment = proposals.reduce((accumulator, proposal) => accumulator + proposal.votes, 0)

  // const votesPerVoter = uniqueVoters.map(voter => 
  //   votes.filter(vote => vote.voter === voter)
  //   )
  // console.log("ASSESSMENT no votes: ", assessment, "TEST: ", votersInMultipleSpaces)

  // const spacesPerVoter = votesPerVoter.map(voter => 
  //   )

  const votersPerSpace = spaces.map(space => {
    const proposalsOfSpace = proposals
      .filter(proposal => proposal.space.id === space)
    
    const votesOfSpace: Vote[] = []
    proposalsOfSpace.map(proposal => 
        votesOfSpace.push(...proposal.votesDetails)
        )
    
    const votersPerSpace = Array.from(new Set( 
      votesOfSpace.map( space => space.voter )
    )) 

    return votersPerSpace
  })

  // console.log("votersOfSpace: ", votersPerSpace)

  const links = votersPerSpace.map(spaceSource => 
    votersPerSpace.map(spaceTarget => {
      if (hasSharedVoters(spaceSource, spaceTarget)) { 
        return { source: spaceSource, target: spaceTarget, value: 1  } 
      } 
    }).flat()
  ).flat()
  .filter(item => item !== undefined) 

  const nodes: NetworkNode[] = spaces.map((space, i) => 
    ({id: space, group: "test"})
  )

  // console.log(
  //   "END RESULT", 
  //   "Nodes: ", nodes, 
  //   "votersOfSpace: ", votersPerSpace, 
  //   "links: ", links
  // )
}

export default { toHeatmapData, toNetworkGraph }; 