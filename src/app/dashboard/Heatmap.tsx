"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { useSuspenseQuery, useApolloClient } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { useSpaces } from "../hooks/useUrl";
import { UseSuspenseQueryResult } from "@apollo/client";
import { toDateFormat } from "../utils/utils";

const HeatMap = () => { 
  const { cache }  = useApolloClient()
  const { selectedSpaces } = useSpaces()
  const cachedSpaces = Object.values(cache.extract())
    .filter(item => item.__typename === "Space") // NB: I can do this with ANY type: spaces, proposals, votes... 
  
  const cachedSpacesIds = cachedSpaces.map(space => space.id)
  const spacesToQuery = selectedSpaces.filter(space => cachedSpacesIds.indexOf(space) === -1)
  spacesToQuery.push(" ") // if no spaces need to be queried, it queries an empty space. 

  let dataLenght = 1000
  let skip = 0

  console.log("EARLIEST PROPOSAL DATE: ", toDateFormat(1595088000 * 1000)) 

  // while (dataLenght === 1000) {
    
    const { error, data }: UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
      variables: { 
        first: 1000, 
        skip: skip, 
        space_in: spacesToQuery} 
    });

    if (error) return `Error! ${error}`;

    // console.log("data: ", data)
    // skip = skip + 1000



    // dataLenght = data.proposals.length
  // }

  

  // should integrate suspense here. See Apollo docs. 
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