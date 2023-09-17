import { useLazyQuery } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { Space } from "@/types";

export const useProposals = async () => { // selectedSpaces: Space[]


  const [ proposalsFromSpaces ] = useLazyQuery(PROPOSALS_FROM_SPACES)
  const skip = 0

  const { data, error, loading } = await proposalsFromSpaces({
          variables: { first: 1000, skip: skip, space_in: ['ctcswap.eth']} 
        })

  if (loading) return null;
  if (error) return `Error! ${error}`;

  console.log(data)

  return { data };
}
