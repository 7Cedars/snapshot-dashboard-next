"use client";

import SpaceItem from "./SpaceItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateModal } from "../../redux/reducers/userInputReducer";
import loadProposals from "../../redux/services/loadProposals";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { SelectedSpaces } from "@/types";

interface spacesListProps {
  selectedSpaces: SelectedSpaces
}

const SpacesList = ({selectedSpaces}: spacesListProps ) => {
  const dispatch = useAppDispatch()

  return (
    <div className="p-2 grid grid-cols-1 place-content-start border border-gray-500 rounded-lg shadow-md mt-20"> 

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