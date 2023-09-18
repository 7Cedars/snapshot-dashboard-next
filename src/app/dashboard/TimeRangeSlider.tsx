"use client";

import { useEffect, useState } from "react";
import { RangeSlider } from "../ui/RangeSlider";
import { useAppSelector } from "@/redux/hooks";
import { Proposal } from "@/types";
import { useDateRange } from '../hooks/useUrl';
import { useDebounce } from "../hooks/useDebounce";

const TimeRangeSlider = () => {
  const { proposals } = useAppSelector(state => state.loadedProposals)
  const { dateA, dateB, handleDates } = useDateRange()
   // the handle dates needs to be debounced: otherwise url is updated too often. 
   const handleDatesDebounced = useDebounce(handleDates, 1000)

  // Setting min and max values 
  let minVal
  let maxVal

  if (proposals.length === 0) {
    minVal = 1678911239007 
    maxVal = 1694690039007
  } else {
    minVal = Math.min(...proposals.map( (proposal: Proposal) => proposal.start) ) 
    maxVal = Math.max(...proposals.map( (proposal: Proposal) => proposal.end) )
  }

  const [valueA, setValueA] = useState(dateA);
  const [valueB, setValueB] = useState(dateB);

  useEffect(() => {
    setValueA(dateA)
    setValueB(dateB)
  }, [dateA, dateB])


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