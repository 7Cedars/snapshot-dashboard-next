import { UseSuspenseQueryResult, useApolloClient, useSuspenseQuery } from "@apollo/client";
import { useDateRange, useSpaces } from "./useUrl";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { toProposals } from "../utils/parsers";
import { Proposal, Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { toSelectedProposals } from "../utils/utils";

export function useProposals() {
  const { selectedSpaces } = useSpaces()
  const { d1, d2 } = useDateRange()
  const { cache }  = useApolloClient()
  const status = useRef<Status>("isIdle")
  const unfetchedSpaces = useRef<String[]>([]);   
  const fetchedSpaces = useRef<String[]>([]); 
  const [selectedProposals, setSelectedProposals] = useState<Proposal[]>();  
  const [allProposals, setAllProposals] = useState<Proposal[]>();  
  const maxVotesProposal: number = 1000 // for now set as static. Can be a value later on.  

  const { networkStatus, data } : UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: unfetchedSpaces.current ? unfetchedSpaces.current : [" "]}
      // context: { fetchOptions: { cache: "force-cache" } }, 
  });
 
  // console.log("cachedProposals @useProposals: ", cachedProposals)
  // console.log("unfetchedSpaces.current @useProposals: ", unfetchedSpaces.current)
  // console.log("networkStatus @useProposals: ", networkStatus) 
  // console.log("allProposals @useProposals: ", allProposals )
  // console.log("selectedProposals @useProposals: ", selectedProposals )
  // console.log("status @useProposals: ", status )

  // translating networkStatus to human readable format. 
  // see for network status values: https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/networkStatus.ts#L4
  useEffect(() => {
    switch(networkStatus) {
      case 1: 
        status.current = "isLoading"; 
        break; 
      case 7: 
        status.current = "isSuccess";
        break; 
      case 8:  
        status.current = "isError";
        break; 
      default: status.current = "isIdle"
    }
  }, [ networkStatus ])

  // triggering the hook when selectedSpaces is changed 
  useEffect(() => {
    const notFetched = selectedSpaces?.filter(spaceId => fetchedSpaces.current.indexOf(spaceId) == -1)
    // console.log("notFetched spaces: ", notFetched)

    if (
      status.current == "isIdle" && 
      networkStatus != 1 && 
      selectedSpaces.length > 0 && 
      notFetched.length > 0 
      ) {
        unfetchedSpaces.current = notFetched
        fetchedSpaces.current = [...fetchedSpaces.current, ...notFetched]
    }
  }, [ , selectedSpaces ])

  // updating state allProposals when useSuspenseQuery is finished. 
  useEffect(() => {
    if (networkStatus === 7) {
      const cachedProposals = toProposals({
        proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
      })
      setAllProposals(cachedProposals)
    } 
  }, [ networkStatus, data ])

  // updating state selectedProposals when useSuspenseQuery is finished, and when datRangechanges . 
  useEffect(() => {
    if (allProposals && d1 && d2 && selectedSpaces) {
      const proposals: Proposal[] = toSelectedProposals({
        proposals: allProposals,
        selectedSpaces: selectedSpaces,
        startDate: Math.min(d1, d2),
        endDate: Math.max(d1, d2), 
        maxVotes: maxVotesProposal
      })
      setSelectedProposals(proposals)
      status.current = "isIdle"
    } 
  }, [, d1, d2, allProposals])


  return { allProposals, selectedProposals, status };
}