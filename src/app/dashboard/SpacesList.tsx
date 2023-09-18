"use client";

import SpaceItem from "./SpaceItem";
import { useAppDispatch } from "../../redux/hooks";
import { updateModal } from "../../redux/reducers/userInputReducer";
import { SelectedSpaces } from "@/types";
// import { useProposals } from "../hooks/useProposals";

interface spacesListProps {
  selectedSpaces: SelectedSpaces
}

// const [ proposalsFromSpaces ] = useLazyQuery(PROPOSALS_FROM_SPACES)


const SpacesList = ({selectedSpaces}: spacesListProps ) => {
  const dispatch = useAppDispatch()
  
  // const handleClick = async () => {
  //   console.log("Button pressed")
    
   
    // const skip = 0
  
    // const { data, error, loading } = await proposalsFromSpaces({
    //         variables: { first: 1000, skip: skip, space_in: ['ctcswap.eth']} 
    //       })
  
    // if (loading) return null;
    // if (error) return `Error! ${error}`;
  
    // console.log(data)
    
  // }

  return (
    <div className="p-2 grid grid-cols-1 place-content-start border border-gray-500 rounded-lg shadow-md m-4"> 
      {/* < Button
        onClick={ handleClick } > 
        TEST Graph QL query
      </Button>  */}

      <div className="pb-3 pt-1 max-h-screen overflow-auto">
        {selectedSpaces.length === 0 ? 
          <i className="grid justify-items-center p-2 my-4 text-gray-500 "> No DAO spaces selected. </i>
          :
          selectedSpaces.map(spaceId => (
            < SpaceItem key = {spaceId} spaceId = {spaceId}/> 
          ))
        }
      </div>

      <form>
        <input
          className="p-2 w-full border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
          type="search"
          id="mySearch"
          name="q"
          placeholder="Search and select DAOs…" 
          onClick={() => dispatch(updateModal('search'))}
          onChange={() => dispatch(updateModal('search'))}
          />
      </form>
    </div>
  );
}

export default SpacesList;