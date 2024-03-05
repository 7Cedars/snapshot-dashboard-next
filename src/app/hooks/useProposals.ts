import { UseSuspenseQueryResult, useApolloClient, useSuspenseQuery } from "@apollo/client";
import { proposalsOfSpaceNotCached } from "../utils/checkCache";
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
  const [uncachedSpaces, setUncachedSpaces] = useState<string[]>();  
  const [selectedProposals, setSelectedProposals] = useState<Proposal[]>([]);  // needs to be proply typed. 
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);  // needs to be proply typed. 

  const { networkStatus } : UseSuspenseQueryResult = useSuspenseQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: uncachedSpaces} 
  });

  // triggering the hook when selectedSpaces is changed 
  useEffect(() => {
    const cachedProposals = toProposals({
      proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
    })
    if (cachedProposals) {
      const { notCached } = proposalsOfSpaceNotCached(selectedSpaces, cachedProposals)
      notCached ? setUncachedSpaces(notCached) : setUncachedSpaces([])
    }
  }, [, selectedSpaces])

  // translating networkStatus to human readable format. 
  // see for network status values: https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/networkStatus.ts#L4
  useEffect(() => {
    switch(networkStatus) {
      case 1:  status.current = "isLoading" 
      case 7:  status.current = "isSuccess"
      case 8:  status.current = "isError"
      default: status.current = "isIdle"
    }
  }, [networkStatus])

  // updating state allProposals when useSuspenseQuery is finished. 
  useEffect(() => {
    if (status.current == "isSuccess") {
      const cachedProposals = toProposals({
        proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
      })
      setAllProposals(cachedProposals)
    } 
  }, [status.current, d1, d2])

    // updating state selectedProposals when useSuspenseQuery is finished, and when datRangechanges . 
    useEffect(() => {
      if (status.current == "isSuccess") {
        const selectedProposals: Proposal[] = toSelectedProposals({
          proposals: allProposals,
          selectedSpaces,
          startDate: Math.min(d1, d2),
          endDate: Math.max(d1, d2)
        })
        setSelectedProposals(selectedProposals)
      } 
    }, [status.current, d1, d2])


  return { allProposals, selectedProposals, status };
}