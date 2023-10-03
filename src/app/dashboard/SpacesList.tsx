"use client";

import SpaceItem from "./SpaceItem";
import { useAppDispatch } from "../../redux/hooks";
import { updateModal } from "../../redux/reducers/userInputReducer";
import { useSpaces } from "../hooks/useUrl";


const SpacesList = () => {
  const { selectedSpaces } = useSpaces() 
  const dispatch = useAppDispatch()

  return (
    <div className="grid grid-cols-1 h-auto place-content-center overflow-x-auto overflow-x-hidden"> 

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

      <div className="pb-3 pt-1 max-h-screen overflow-x-auto overflow-x-hidden">
        {selectedSpaces.length === 0 ? 
          <i className="grid justify-items-center my-4 text-gray-500 "> No DAO spaces selected. </i>
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