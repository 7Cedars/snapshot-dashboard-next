import { Space, Proposal, Vote } from "@/types"
import spaces from "../../../public/data/spacesList"
import { useApolloClient } from "@apollo/client"
import { toProposals } from "./parsers"

export const proposalsOfSpaceNotCached = (selectedSpaces: string[]) => {
  // checkes if all proposals have been loaded for list of spaces. 
  // does this by comparing votesCount as stated in spacesList, to sum of votes of cached proposals. 
  // These two do not always align completely, so a margin (by percentage) is included.  

  const { cache }  = useApolloClient()
  const cachedProposals: Proposal[] = toProposals({proposals: 
    Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")
  })

  const cachedProposalsBySpace = selectedSpaces.map(spaceId => 
    cachedProposals.filter(proposal => proposal.space.id === spaceId ))
  const cachedVoteCount = cachedProposalsBySpace.map(array =>
    array.reduce((n: any, { votes } ) => n + votes, 0)
    )

  const selectedSavedSpaces: Space[] = selectedSpaces.map(spaceId => 
    spaces.filter(space => space.id === spaceId ) ).flat()
  const savedVotesCount = selectedSavedSpaces.map(space => space.votesCount)

  const result = selectedSpaces.map((space, i) => ({
    spaceId: space, 
    savedVotesCount: savedVotesCount[i], 
    cachedVoteCount: cachedVoteCount[i]
  }));
  
  let notCached: string[] = []
  selectedSpaces.forEach((space, i) => {
    if (Math.abs(savedVotesCount[i] - cachedVoteCount[i]) > (savedVotesCount[i] * .05)) {
      notCached.push(space) 
    } 
  })

  return ({ 
    result: result,
    notCached: notCached
    }) 
}

export const votesOfProposalNotCached = (selectedProposals: string[]) => {
  const { cache }  = useApolloClient()
  const cachedVotes = 
    Object.values(cache.extract())
    .filter(item => item.__typename === "Vote")


}