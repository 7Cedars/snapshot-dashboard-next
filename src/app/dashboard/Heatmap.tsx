"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { useSuspenseQuery, useApolloClient, gql, InMemoryCache, useFragment } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { useSpaces } from "../hooks/useUrl";

const HeatMap = () => { 
  const { cache }  = useApolloClient()
  const { selectedSpaces } = useSpaces()
  const cachedSpaces = Object.values(cache.extract())
    .filter(item => item.__typename === "Space") // NB: I can do this with ANY type: spaces, proposals, votes... 
  
  const cachedSpacesIds = cachedSpaces.map(space => space.id)
  const spacesToQuery = selectedSpaces.filter(space => cachedSpacesIds.indexOf(space) === -1)
  spacesToQuery.push(" ") // if no spaces need to be queried, it queries an empty space. 

  const { error, data } = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: spacesToQuery} 
  });

  if (error) return `Error! ${error}`;

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