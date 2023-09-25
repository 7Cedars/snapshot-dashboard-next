import { Space, Proposal, Vote } from "@/types"
import spaces from "../../../public/data/spacesList"
import { useApolloClient } from "@apollo/client"
import { toProposals, toVotes } from "./parsers"


export const proposalsOfSpaceNotCached = (selectedSpaces: string[]) => {
  const { cache }  = useApolloClient()
  const cachedProposals: Proposal[] = toProposals({proposals: 
    Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")
  })
  // checkes if all proposals have been loaded for list of spaces. 
  // does this by comparing votesCount as stated in spacesList, to sum of votes of cached proposals. 
  // These two do not always align completely, so a margin (by percentage) is included.  

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

export const votesOfProposalNotCached = (selectedProposals: string[], filterLargeProposals: boolean) => {
  const { cache }  = useApolloClient()
  const cachedProposals: Proposal[] = toProposals({proposals: 
    Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal")
  })

  const cachedQueries = Object.values(cache.extract())
    .filter(item => item.__typename === 'Query')[0]
  const cachedQueriesFlat = (Array.from(Object.values(cachedQueries))).flat()
  
  const cachedVotes: Vote[] = toVotes(cachedQueriesFlat
    .filter((item: any) => item.__typename === 'Vote' )
  )

  const cachedVotesByProposal = selectedProposals.map(proposalId => 
    cachedVotes.filter(vote => vote.proposal.id === proposalId ))
  const cachedVoteCount = cachedVotesByProposal.map(array => array.length)
  
  const savedVotesCount = cachedProposals.map(proposal => proposal.votes)

  const result = selectedProposals.map((proposal, i) => ({
    proposalId: proposal, 
    savedVotesCount: savedVotesCount[i], 
    cachedVoteCount: cachedVoteCount[i]
  }));

  let notCached: string[] = []
  if (filterLargeProposals === false) {  
    selectedProposals.forEach((proposal, i) => {
      if (Math.abs(savedVotesCount[i] - cachedVoteCount[i]) > (savedVotesCount[i] * .05)) {
        notCached.push(proposal) 
      } 
    })
  } else {
    selectedProposals.forEach((proposal, i) => {
      if (Math.abs(savedVotesCount[i] - cachedVoteCount[i]) > (savedVotesCount[i] * .05) 
          && savedVotesCount[i] < 1000 ) {
        notCached.push(proposal) 
      } 
    })
  }

  return ({ 
    result: result,
    notCached: notCached
    }) 

}