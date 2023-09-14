"use client";

import { useState } from "react";
import { RangeSliderMod } from "../ui/RangeSliderMod";
import { useAppSelector } from "@/redux/hooks";
import { standardDateRange } from "../../../constants";
import { Proposal } from "@/types";

const TimeRangeSlider = () => {
  const { proposals } = useAppSelector(state => state.loadedProposals)
  
  let minVal
  let maxVal

  if (proposals.length === 0) {
    minVal = Date.now() - standardDateRange  
    maxVal = Date.now()

  } else {
     minVal = Math.min(...proposals.map( (proposal: Proposal) => proposal.start) ) 
     maxVal = Math.max(...proposals.map( (proposal: Proposal) => proposal.end) )
  }

  console.log("MIN AND MAX: ", minVal, maxVal)

  const [valueA, setValueA] = useState(minVal * 1.1);
  const [valueB, setValueB] = useState(maxVal * 0.9);

  const handleValueChange = (value: number) => {
    if (Math.abs(value - valueA) <  Math.abs(value - valueB)) {
      setValueA(value)
    } else {
      setValueB(value)
    }
    
    // setMinValue (Math.min(valueA, valueB))
    // setMaxValue (Math.max(valueA, valueB))
  }

  console.log("VALUES: ", valueA, valueB)
  
  return (
    <>
      <RangeSliderMod 
        minVal = {minVal}
        maxVal = {maxVal}
        minLabel = 'min' 
        maxLabel = 'max'
        valA={valueA}
        valB={valueB}
        onChangeA={( {target} ) => handleValueChange(Number(target.value))}
        onChangeB={( {target} ) => handleValueChange(Number(target.value))}
        >
          TEST TEST
      </RangeSliderMod>
    </>
  );
}


export default TimeRangeSlider;