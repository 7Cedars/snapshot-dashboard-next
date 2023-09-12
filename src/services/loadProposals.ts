// import SelectSpacesForm from "../searchComponent/SelectSpacesForm (depricated)"
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { addProposals } from "../reducers/proposalsReducer";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { useLazyQuery } from "@apollo/client";

const [ proposalsFromSpaces ] = useLazyQuery(PROPOSALS_FROM_SPACES) 
const dispatch = useAppDispatch()
const { stopFetching } = useAppSelector(state => state.userInput)

export const loadProposals = async (spacesToLoad: string[]) => {

  console.log("loadProposal is called") 
  let fetchProposals = true;
  let skip = 0; 
  while (stopFetching === false && fetchProposals === true) {

    const { data } = await proposalsFromSpaces({
      variables: { first: 1000, skip: skip, space_in: spacesToLoad} 
    })

    console.log("FETCHED PROPOSALS: ", data)
    console.log("LENGTH Fetch: ", data.proposals.length)

    dispatch(addProposals(data.proposals))

    if (data.proposals.length !== 1000) {
      fetchProposals = false
    } else {
      skip = skip + 1000
    }

  }
}

export default loadProposals