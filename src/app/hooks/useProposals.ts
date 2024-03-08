import { UseSuspenseQueryResult, useApolloClient, useQuery, useSuspenseQuery } from "@apollo/client";
import { useDateRange, useSpaces } from "./useUrl";
import { PROPOSALS_FROM_SPACES } from "../utils/queries";
import { toProposals } from "../utils/parsers";
import { Proposal, SelectedSpaces, Status } from "@/types";
import { lazy, useEffect, useRef, useState } from "react";
import { toSelectedProposals } from "../utils/utils";
import { UseQueryResult } from "@tanstack/react-query";

export function useProposals() {
  const { selectedSpaces } = useSpaces()
  const { d1, d2 } = useDateRange()
  const { cache }  = useApolloClient()
  const statusFetchingSpaces = useRef<Status>("isIdle")
  const statusToSelectedProposals = useRef<Status>("isIdle")
  const runtimeSpaces = useRef<String[]>([]);
  const runtimed1 = useRef<number>();   
  const runtimed2 = useRef<number>();   
  const unfetchedSpaces = useRef<String[]>([]);   
  const fetchedSpaces = useRef<String[]>([]); 
  const [selectedProposals, setSelectedProposals] = useState<Proposal[]>();  
  const [allProposals, setAllProposals] = useState<Proposal[]>();  
  const [selectionNeeded, setSelectionNeeded] = useState<boolean>(false)
  const maxVotesProposal: number = 1000 // for now set as static. Can be a value later on.  

  const { loading, error, data } = useQuery(PROPOSALS_FROM_SPACES, { // useSuspenseQuery
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: unfetchedSpaces.current ? unfetchedSpaces.current : [" "]}
      // context: { fetchOptions: { cache: "force-cache" } }, 
  });
 
  // console.log("cachedProposals @useProposals: ", cachedProposals)
  console.log("unfetchedSpaces.current @useProposals: ", unfetchedSpaces.current)
  // console.log("networkStatus @useProposals: ", networkStatus) 
  console.log("allProposals @useProposals: ", allProposals )
  console.log("selectedProposals @useProposals: ", selectedProposals )
  console.log("statusFetchingSpaces @useProposals: ", statusFetchingSpaces )
  console.log("statusToSelectedProposals @useProposals: ", statusToSelectedProposals )
  console.log("selectedSpaces  @useProposals: ", selectedSpaces)
  console.log("selectionNeeded  @TRIGGER: ", selectionNeeded)

  // triggering the hook when selectedSpaces is changed 
  useEffect(() => {
    const notFetched = selectedSpaces?.filter(spaceId => fetchedSpaces.current.indexOf(spaceId) == -1)
    console.log("notFetched spaces: ", notFetched)

    if (
      !loading && 
      data.length != notFetched.length &&
      notFetched.length > 0 
      ) {         
        unfetchedSpaces.current = notFetched
        fetchedSpaces.current = [...fetchedSpaces.current, ...notFetched]
        statusFetchingSpaces.current = "isLoading"
    }
  }, [ , selectedSpaces, loading ])

  // updating state allProposals when useSuspenseQuery is finished. 
  useEffect(() => {
    if (!error && !loading && data) {
      const cachedProposals = toProposals({
        proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
      })
      statusFetchingSpaces.current = "isSuccess"
      setAllProposals(cachedProposals)
    } 
  }, [ error, loading, data ])

  useEffect(() => {
  console.log("selectedSpaces: @TRIGGER", selectedSpaces.length)
  console.log("runtimeSpaces: @TRIGGER", runtimeSpaces.current.length)
   if (
    selectedSpaces.length != runtimeSpaces.current.length || 
    d1 != runtimed1.current || 
    d2 != runtimed2.current
    ) setSelectionNeeded(true)
   if (
    selectedSpaces.length == runtimeSpaces.current.length &&
    d1 == runtimed1.current &&  
    d2 == runtimed2.current
    ) setSelectionNeeded(false)
  }, [selectedSpaces])

  // updating state selectedproposals when selectedSpaces and datRangechanges change. 
  useEffect(() => {
    console.log("ToSelectedProposals TRIGGERED")

    if (
      allProposals && 
      d1 && 
      d2 && 
      selectedSpaces && 
      statusFetchingSpaces.current == "isSuccess" && 
      selectionNeeded
      ) {  
      statusToSelectedProposals.current = "isLoading"
      runtimeSpaces.current = selectedSpaces
      runtimed1.current = d1
      runtimed2.current = d2

      const proposals: Proposal[] = toSelectedProposals({
        allProposals: allProposals,
        selectedSpaces: selectedSpaces,
        startDate: Math.min(d1, d2),
        endDate: Math.max(d1, d2), 
        maxVotes: maxVotesProposal
      })
      setSelectedProposals(proposals)
      statusToSelectedProposals.current = "isSuccess"
    } 
  }, [, d1, d2, selectionNeeded ])

  return { allProposals, selectedProposals };
}
