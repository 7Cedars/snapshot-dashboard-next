"use client";

import { useEffect, useState } from "react";
import { RangeSlider } from "../ui/RangeSlider";
import { Proposal } from "@/types";
import { useDateRange } from '../hooks/useUrl';
import { standardDateRange } from "../../../constants";
import { useDebounce } from "../hooks/useDebounce";
import { useApolloClient } from "@apollo/client";

const TimeRangeSlider = () => {
  const { dateA, dateB, handleDates } = useDateRange()
  const { cache }  = useApolloClient()
  const handleDatesDebounced = useDebounce(handleDates, 500)

  // console.log("dateA: ", dateA, "dateB: ", dateB)

  // NB: how I set these dates can be improved. 
  // date today often falls outside date range of selected proposals... 
  const cachedProposals = Object.values(cache.extract())
    .filter(item => item.__typename === "Proposal") // NB: I can do this with ANY type: spaces, proposals, votes... 

  let minVal
  let maxVal

  if (cachedProposals.length === 0) {
    minVal = Date.now() - standardDateRange
    maxVal = Date.now() 

  } else {
    minVal = Math.min(...cachedProposals.map( (proposal: Proposal) => (proposal.start * 1000)) ) 
    maxVal = Math.max(...cachedProposals.map( (proposal: Proposal) => (proposal.end * 1000)) )
  }

  // console.log("minVal: ", minVal ,"maxVal: ", maxVal)
  
  const [valueA, setValueA] = useState(minVal);
  const [valueB, setValueB] = useState(maxVal);

  useEffect(() => {
    setValueA(dateA)
    setValueB(dateB)
  }, [dateA, dateB])

  // console.log("valueA: ", valueA ,"valueB: ", valueB)


  // Note: despite only top slider being called, it updates the value of teh slider that is closest to pointer.
  // it gives the impression of interacting with both sliders. 
  const handleValueChange = (value: number) => {

    if (Math.abs(value - dateA) < Math.abs(value - dateB)) {
      setValueA(value)
      handleDatesDebounced(String(value), String(dateB))
    } else {
      setValueB(value)
      handleDatesDebounced(String(dateA), String(value))
    }
  }

  return (
    <div className="pt-4"> 

      <RangeSlider
        minVal = {minVal}
        maxVal = {maxVal}
        minLabel = 'min' 
        maxLabel = 'max'
        valA={valueA}
        valB={valueB}
        onChangeA={( {target} ) => handleValueChange(Number(target.value)) }
        onChangeB={( {target} ) => handleValueChange(Number(target.value))}
        >
        Time Range Analysis
      </RangeSlider>
    </div>

  );
}


export default TimeRangeSlider;