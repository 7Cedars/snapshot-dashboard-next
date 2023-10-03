"use client";

import { useEffect, useState } from "react";
import { RangeSlider } from "../ui/RangeSlider";
import { useDateRange } from '../hooks/useUrl';
import { standardDateRange, genesisSnapshot } from "../../../constants";
import { useDebounce } from "../hooks/useDebounce";

const TimeRangeSlider = () => {
  const { d1, d2, handleDates } = useDateRange()
  const handleDatesDebounced = useDebounce(handleDates, 500)

  const minVal = genesisSnapshot
  const maxVal = Date.now()
  
  const [value1, setValue1] = useState(maxVal - standardDateRange );
  const [value2, setValue2] = useState(maxVal);

  useEffect(() => {
    setValue1(d1)
    setValue2(d2)
  }, [d1, d2])

  // Note: despite only top slider being called, it updates the value of teh slider that is closest to pointer.
  // it gives the impression of interacting with both sliders. 
  const handleValueChange = (value: number) => {

    if (Math.abs(value - d1) < Math.abs(value - d2)) {
      setValue1(value)
      handleDatesDebounced(String(value), String(d2))
    } else {
      setValue2(value)
      handleDatesDebounced(String(d1), String(value))
    }
  }

  return (
    <div className="p-0"> 
      <RangeSlider
        minVal = {minVal}
        maxVal = {maxVal}
        minLabel = 'min' 
        maxLabel = 'max'
        valA={value1}
        valB={value2}
        onChangeA={( {target} ) => handleValueChange(Number(target.value)) }
        onChangeB={( {target} ) => handleValueChange(Number(target.value))}
        >
        Time Range Analysis
      </RangeSlider>
    </div>

  );
}


export default TimeRangeSlider;