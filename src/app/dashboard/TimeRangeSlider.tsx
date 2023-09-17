"use client";

import { useState } from "react";
import { RangeSliderMod } from "../ui/RangeSlider";
import { useAppSelector } from "@/redux/hooks";
import { Proposal } from "@/types";
import { useDateRange } from '../hooks/useUrl';

const TimeRangeSlider = () => {
  const { proposals } = useAppSelector(state => state.loadedProposals)
  const { handleDates } = useDateRange()
  
  let minVal
  let maxVal

  if (proposals.length === 0) {
    minVal = 1678911239007 
    maxVal = 1694690039007
  } else {
     minVal = Math.min(...proposals.map( (proposal: Proposal) => proposal.start) ) 
     maxVal = Math.max(...proposals.map( (proposal: Proposal) => proposal.end) )
  }

  console.log("MIN AND MAX: ", minVal, maxVal)

  const [valueA, setValueA] = useState(minVal + ((maxVal - minVal) / 6) );
  const [valueB, setValueB] = useState(maxVal - ((maxVal - minVal) / 6));

  const handleValueChange = (value: number) => {

    if (Math.abs(value - valueA) < Math.abs(value - valueB)) {
      setValueA(value)
    } else {
      setValueB(value)
    }
  }
  handleDates([String(valueA), String(valueB)])
  
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