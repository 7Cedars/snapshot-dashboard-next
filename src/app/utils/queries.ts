import { gql } from '@apollo/client'

    // votesCount
    // categories

const SPACE_DETAILS = gql`
  fragment SpaceDetails on Space {
    id
  }
`

const PROPOSAL_DETAILS = gql`
  fragment ProposalDetails on Proposal {
    id
    space {
      id
    }
    votes
    start
    end
  }
`

export const LIST_SPACES = gql`
  query listSpaces($first: Int!, $skip:Int!){
    spaces(
      first: $first,
      skip: $skip,
      orderBy: "created",
      orderDirection: asc
    ) {
      ...SpaceDetails 
    }
  }
  ${SPACE_DETAILS}
`

export const PROPOSALS_FROM_SPACES = gql`
  query proposalsFromSpaces($first: Int!, $skip:Int!, $space_in:[String!]!){
    proposals(
      first: $first,
      skip: $skip,
      where: {
        space_in: $space_in,
        state: "closed"
      },
      orderBy: "created",
      orderDirection: asc
    ) {
      ...ProposalDetails 
    }
  }
  ${PROPOSAL_DETAILS}
`

export const VOTERS_ON_PROPOSALS = gql`
  query votersOnProposals($first: Int!, $skip:Int!, $proposal_in:[String!]!){
    votes (
      first: $first, 
      skip: $skip,
      where: {
        proposal_in: $proposal_in
      }
    ) {
      voter
      created
      proposal {
        id
      }
    }
  }
`