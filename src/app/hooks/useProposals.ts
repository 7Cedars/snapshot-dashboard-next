import { useApolloClient, useQuery } from "@apollo/client";
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
  
  const statusFetchingSpaces = useRef<Status>("isIdle")
  const statusToSelectedProposals = useRef<Status>("isIdle")
  const status = useRef<Status>("isIdle")

  const runtimeSpaces = useRef<String[]>([]);
  const runtimeD1 = useRef<number>();   
  const runtimeD2 = useRef<number>();   
  const unfetchedSpaces = useRef<String[]>([]);   
  const fetchedSpaces = useRef<String[]>([]); 
 
  const [selectedProposals, setSelectedProposals] = useState<Proposal[]>();  
  const [allProposals, setAllProposals] = useState<Proposal[]>();  
  const [selectionNeeded, setSelectionNeeded] = useState<boolean>(true)
  const maxVotesProposal: number = 1000 // £todo: need to fetch more votes from larger proposals - set value at constants  

  const { loading, error, data } = useQuery(PROPOSALS_FROM_SPACES, { 
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: unfetchedSpaces.current ? unfetchedSpaces.current : [" "]}
  });
 
  // triggering loading spaces when selectedSpaces changes and there are unfetched Spaces.  
  useEffect(() => {
    const notFetched = selectedSpaces?.filter(spaceId => fetchedSpaces.current.indexOf(spaceId) == -1)
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

  // detached selectedSpaces from reloading hook as it led to loop. 
  // this useEffect first checks if actual reload is needed before triggering. 
  useEffect(() => {
   if (
    selectedSpaces.length > 0 && 
    selectedSpaces.length != runtimeSpaces.current.length || 
    d1 != runtimeD1.current || 
    d2 != runtimeD2.current
    ) {
      setSelectionNeeded(true)
    }
   if (
    selectedSpaces.length == runtimeSpaces.current.length &&
    d1 == runtimeD1.current &&  
    d2 == runtimeD2.current && 
    statusFetchingSpaces.current != "isSuccess" 
    ) setSelectionNeeded(false)
  }, [ selectedSpaces, d1, d2, statusFetchingSpaces.current ])

  // updating state selectedproposals when selectionNeeded is updated. 
  useEffect(() => {
    statusToSelectedProposals.current = "isLoading"
    if (
      selectionNeeded && 
      allProposals
      ) {  
        const proposals: Proposal[] = toSelectedProposals({
          allProposals: allProposals ? allProposals : [],
          selectedSpaces: selectedSpaces,
          startDate: Math.min(d1, d2),
          endDate: Math.max(d1, d2), 
          maxVotes: maxVotesProposal
        })
        runtimeSpaces.current = selectedSpaces
        runtimeD1.current = d1
        runtimeD2.current = d2
        proposals.length > 0 ? statusToSelectedProposals.current = "isSuccess" : statusToSelectedProposals.current = "isIdle"
        setSelectedProposals(proposals)
    } 
  }, [, selectionNeeded, allProposals ])
    
  // managing updates status 
  useEffect(() => {
    if (
      statusFetchingSpaces.current == "isIdle" || 
      statusToSelectedProposals.current == "isIdle" 
    ) status.current = "isIdle"
    if (
      statusFetchingSpaces.current == "isSuccess" && 
      statusToSelectedProposals.current == "isSuccess" 
    ) status.current = "isSuccess"
    if (
      statusFetchingSpaces.current == "isLoading" || 
      statusToSelectedProposals.current == "isLoading" 
    ) status.current = "isLoading"
  }, [statusFetchingSpaces.current, statusToSelectedProposals.current])

  return { allProposals, selectedProposals, status };
}
