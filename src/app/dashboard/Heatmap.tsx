"use client";

import { Heatmap } from "./charts/Heatmap";
import { ChartCanvas } from "../ui/ChartCanvas";
import { useSuspenseQuery, useApolloClient } from "@apollo/client";
import { PROPOSALS_FROM_SPACES, VOTERS_ON_PROPOSALS } from "../utils/queries";
import { useSpaces } from "../hooks/useUrl";
import { UseSuspenseQueryResult } from "@apollo/client";
import { toDateFormat } from "../utils/utils";
import { toProposals } from "../utils/parsers";
import spaces from "../../../public/data/spacesList";
import { Proposal, Space } from "@/types";
import { proposalsOfSpaceNotCached } from "../utils/checkCache";

const HeatMap = () => { 
   
  const { selectedSpaces } = useSpaces()

  // Everytime that graphQL querie for proposals is run, proposalsOfSpaceNotCached reruns. 
  // it means I do NOT need to create loop for useSuspenseQuery: 
  // it will keep on going until it has fetched them all. 
  // The one schenario where this keeps going is if there is a space with more
  // than 1000 proposals - which does not exist. 
  const notCached = proposalsOfSpaceNotCached(selectedSpaces)
  console.log("proposalsOfSpaceNotCached: ",  notCached)

  const spacesToQuery = notCached.notCached
  spacesToQuery.push(" ") // if no spaces need to be queried, it queries an empty space. 

  const { error, data }: UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: spacesToQuery} 
  });

  if (error) return `Error! ${error}`;


  const { error: error2, data: data2 }: UseSuspenseQueryResult = useSuspenseQuery(VOTERS_ON_PROPOSALS, {
    variables: { 
      first: 1000, 
      skip: 0, 
      proposal_in: ["0x55d60f39563c5f14e9c48d8fcddb9daac577c9f5eb3cf130dfa56d01e7a983db"]} 
  });

  if (error2) return `Error! ${error2}`;

  console.log("data2: ", data2)

  useApolloClient().resetStore
  const { cache }  = useApolloClient()
  const cachedVotes = 
  new Set(
    Object.values(cache.extract())
    //.filter(item => item.__typename === 'Query' ) 
  .map(item => item.__typename)) 
  // .filter(item => item.proposal.id === "0x55d60f39563c5f14e9c48d8fcddb9daac577c9f5eb3cf130dfa56d01e7a983db")
    //.filter(item => item.__typename === 'Vote' )

  console.log("cachedVotes: ", cachedVotes)

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