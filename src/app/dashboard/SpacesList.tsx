"use client";

import SpaceItem from "./SpaceItem";
import { useAppDispatch } from "../../redux/hooks";
import { updateModal } from "../../redux/reducers/userInputReducer";
import { SelectedSpaces } from "@/types";

interface spacesListProps {
  selectedSpaces: SelectedSpaces
}

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
    <div className="grid grid-cols-1 relative h-auto min-w-fit place-content-start"> 
      {/* < Button
        onClick={ handleClick } > 
        TEST Graph QL query
      </Button>  */}

      <form>
        <input
          className="p-2 w-full min-w-fit border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
          type="search"
          id="mySearch"
          name="q"
          placeholder="Search and select DAOs…" 
          onClick={() => dispatch(updateModal('search'))}
          onChange={() => dispatch(updateModal('search'))}
          />
      </form>

      <div className="pb-3 pt-1 max-h-screen overflow-auto">
        {selectedSpaces.length === 0 ? 
          <i className="grid justify-items-center p-2 my-4 text-gray-500 "> No DAO spaces selected. </i>
          :
          selectedSpaces.map(spaceId => (
            < SpaceItem key = {spaceId} spaceId = {spaceId}/> 
          ))
        }
      </div>
    </div>
  );
}

export default SpacesList;