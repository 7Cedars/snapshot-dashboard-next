"use client";

import { useEffect, useState } from "react";
import { RangeSlider } from "../ui/RangeSlider";
import { Proposal } from "@/types";
import { useDateRange } from '../hooks/useUrl';
import { standardDateRange, genesisSnapshot } from "../../../constants";
import { useDebounce } from "../hooks/useDebounce";
import { useApolloClient } from "@apollo/client";

interface dateRangeProps {
  dateRange: {
    dateA: number, 
    dateB: number
  }
}

const TimeRangeSlider = () => {
  const { dateA, dateB, handleDates } = useDateRange()
  const { cache }  = useApolloClient()
  const handleDatesDebounced = useDebounce(handleDates, 500)

  const minVal = genesisSnapshot
  const maxVal = Date.now()
  
  const [valueA, setValueA] = useState(maxVal - standardDateRange );
  const [valueB, setValueB] = useState(maxVal);

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
    <div className="p-0"> 

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