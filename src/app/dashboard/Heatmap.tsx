"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { useSuspenseQuery, useApolloClient, gql, InMemoryCache, useFragment } from "@apollo/client";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { useSpaces } from "../hooks/useUrl";

const HeatMap = () => { 
  // NB: This seems to work!!! I can acces CASHED GraphQL data in any component! 
  // IMPLEMENT THIS THROUGHOUT! 

  // first: get the cache - and loaded spaces. 
  const { cache }  = useApolloClient()
  const cachedSpaces = Object.values(cache.extract())
    .filter(item => item.__typename === "Space") // NB: I can do this with ANY type: spaces, proposals, votes... 
  const cachedSpacesIds = cachedSpaces.map(space => space.id)
  
  // then compare against spaces selected in URL... 
  const { selectedSpaces } = useSpaces()
  const spacesToQuery = selectedSpaces.filter(space => cachedSpacesIds.indexOf(space) === -1)
  spacesToQuery.push(" ")

  // end graphQL query the difference... 
  const { error, data } = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: spacesToQuery} 
  });


  if (error) return `Error! ${error}`;
  console.log("data: ", data) 

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