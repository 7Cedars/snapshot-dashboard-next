"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { SearchParams } from "@/types";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useLazyQuery } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { addProposals } from "../../redux/reducers/proposalsReducer";
import { useDateRange, useSpaces } from "../hooks/useUrl";

const HeatMap =  ( ) => { 
  // const dispatch = useAppDispatch()
  // const { proposals } = useAppSelector(state => state.loadedProposals)
  // const [ proposalsFromSpaces ] = useLazyQuery(PROPOSALS_FROM_SPACES)
  // const { dateRange } = useDateRange()
  // const { selectedSpaces } = useSpaces ()

  // const { stopFetching } = useAppSelector(state => state.userInput)

  // const loadedSpaces = Array.from(
  //   new Set(proposals.map(proposal => proposal.space.id))
  // ) 

  // const spacesToLoad = selectedSpaces.filter(
  //   spaceId => loadedSpaces.indexOf(spaceId) === -1
  // )

  // const loadProposals = async (spacesToLoad: string[]) => {
    
  //   console.log("loadSpaces is called") 
  //   let fetchProposals = true;
  //   let skip = 0; 
  //   while (stopFetching === false && fetchProposals === true) {
  
  //     const { data, error, loading } = await proposalsFromSpaces({
  //       variables: { first: 1000, skip: skip, space_in: spacesToLoad} 
  //     })
  
  //     console.log("FETCHED PROPOSALS: ", data)
  //     console.log("LENGTH Fetch: ", data.proposals.length)
  
  //     dispatch(addProposals(data.proposals))
  
  //     if (data.proposals.length !== 1000) {
  //       fetchProposals = false
  //     } else {
  //       skip = skip + 1000
  //     }
  //   }
  // }

  // if (spacesToLoad.length > 1) {loadProposals(spacesToLoad)}

  return (
    <div> 

      <b> Time Range Component </b>    
          <ChartCanvas
            VizComponent={ Heatmap }
            vizName={"heatmap"}
            maxWidth={2000}
            height={300}
            />
    </div>
  );
}

export default HeatMap;