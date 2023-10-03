"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { useSuspenseQuery } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { useSpaces } from "../hooks/useUrl";
import { UseSuspenseQueryResult } from "@apollo/client";
import { proposalsOfSpaceNotCached } from "../utils/checkCache";

const HeatMap = () => {   
  const { selectedSpaces } = useSpaces()
  const notCached = proposalsOfSpaceNotCached(selectedSpaces)
  const height = selectedSpaces.length * 30 
  const spacesToQuery = notCached.notCached

  spacesToQuery.push(" ") // if no spaces need to be queried, it queries an empty space. 

  const { error }: UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: spacesToQuery} 
  });

  if (error) return `Error! ${error}`; // needs to be transformed to proper notification 

  // should integrate suspense here. See Apollo docs. 
  return (
    <div className="border border-gray-300 mt-4 rounded-lg"> 
      <ChartCanvas
        VizComponent={ Heatmap }
        vizName={"heatmap"}
        maxWidth={3000}
        height={height}
        />
    </div>
  );
}

export default HeatMap;