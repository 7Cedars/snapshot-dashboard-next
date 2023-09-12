"use client";

import { useEffect, useState } from "react";
// import SelectSpacesForm from "../searchComponent/SelectSpacesForm (depricated)"
// import { useParams } from "react-router-dom";
import { useParams } from 'next/navigation'
import { parseUrlInput } from "../utils/parsers";
import { useAppDispatch, useAppSelector } from "../../redux/reducers/hooks";
// import { updateEndDate, updateSelectedSpaces, updateStartDate } from "../reducers/userInputReducer";
import loadProposals from "../../redux/services/loadProposals";
import { useLazyQuery } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";

// import loadProposals from "../services/loadProposals";
import { updateStopFetching } from "../../redux/reducers/userInputReducer";

const UpdateState = () => {
  const dispatch = useAppDispatch()
  const { data } = useParams();
  const { stopFetching } = useAppSelector(state => state.userInput)
  const { proposals } = useAppSelector(state => state.loadedProposals)

  useEffect(() => {
    const {selectedSpaces }  = parseUrlInput(data)

    const loadedSpaces = Array.from(
      new Set(proposals.map(proposal => proposal.space.id))
    ) 
  
    const spacesToLoad = selectedSpaces.filter(
      (spaceId: string) => loadedSpaces.indexOf(spaceId) === -1
    )
    console.log("spacesToLoad: ",  spacesToLoad)
    loadProposals(spacesToLoad)
    
  }, [data])


  const handleOnClick = () => {
    dispatch(updateStopFetching(!stopFetching)) 
  }

  return (
    <>
      <button 
        type="submit"
        // disabled={selectedSpaces.length < 2} 
        className='border-blue-500 bg-blue-100 text-blue-900 border w-full rounded-lg font-medium p-2 enabled:hover:bg-blue-200 disabled:opacity-50'
        onClick={handleOnClick}
        >
          {stopFetching ? 'Start fetching' : 'Stop fetching' }
      </button> 
    </>
  );
}


export default UpdateState;