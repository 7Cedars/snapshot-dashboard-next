import SpaceItem from "./SpaceItem";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { updateModal } from "../reducers/userInputReducer";
import loadProposals from "../services/loadProposals";
import { useEffect, useState } from "react";
import { parseUrlInput } from "../utils/parsers";
import { useParams } from "react-router-dom";

const SpacesList = () => {
  console.log("DATA: ")
  const dispatch = useAppDispatch()
  const [selectedSpaces, setSelectedSpaces] = useState(['']) 
  // const { selectedSpaces } = useAppSelector(state => state.userInput)
  const { data } = useParams();

  
  useEffect(() => {
    const { selectedSpaces }  = parseUrlInput(data)
    setSelectedSpaces(selectedSpaces)
  }, [])

  return (
    <div className="p-2 grid grid-cols-1 place-content-start border border-gray-500 rounded-lg shadow-md mt-20"> 
      {/* <button 
        type="submit"
        disabled={selectedSpaces.length < 2} 
        className='border-blue-500 bg-blue-100 text-blue-900 border w-full rounded-lg font-medium p-2 enabled:hover:bg-blue-200 disabled:opacity-50'
        onClick={handleOnClick}
        >
        Analyse
      </button>  */}

      <div className="pb-3 pt-1 max-h-screen overflow-auto">
        {selectedSpaces.length === 1 ? 
        <i className="grid justify-items-center p-2 my-4 text-gray-500 "> No DAO spaces selected. </i>
        :
        selectedSpaces.map(spaceId => (
          < SpaceItem key = {spaceId} spaceId = {spaceId}/> 
        ))        
        }
      </div>

      <form>
        <input
          className="w-full border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
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