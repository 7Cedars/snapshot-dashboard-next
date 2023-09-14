"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { updateUrl } from "../../redux/reducers/urlReducer";
import { standardDateRange } from "../../../constants";
import { toDateFormat } from "../utils/utils";
import { Proposal } from "../../types" 
import { useStartDate, useEndDate } from "../hooks/useUrl";

// interface RangeSliderProps {
//   ValueA: number;
//   ValueB: number;
// }

type RangeSliderProps = {
  MinValue: number;
  MaxValue: number;
  ValueA: number;
  ValueB: number;
  isDisabled?: boolean;
  children: any;
  onChangeStart:() => number;
  onChangeStop: () => void;
  // size?: "sm" | "md";
};

export const RangeSlider = ( ) => {
  const { proposals } = useAppSelector(state => state.loadedProposals)
  const { endDate, handleEndDate } = useEndDate()
  const { startDate, handleStartDate } = useStartDate()

  let minVal
  let maxVal

  if (proposals.length === 0) {
    minVal = Date.now() - standardDateRange  
    maxVal = Date.now()

  } else {
     minVal = Math.min(...proposals.map( (proposal: Proposal) => proposal.start) ) 
     maxVal = Math.max(...proposals.map( (proposal: Proposal) => proposal.end) )
  }

  const [valueA, setValueA] = useState(minVal);
  const [valueB, setValueB] = useState(maxVal);

  const handleValueChange = (value: number) => {
    if (Math.abs(value - valueA) <  Math.abs(value - valueB)) {
      setValueA(value)
    } else {
      setValueB(value)
    }
    

    onChangeStart(Math.min(valueA, valueB))
    handleEndDate(Math.max(valueA, valueB))

  }

  return (
    
    <div
      className="flex justify-between relative w-full/[.9] p-3 m-3 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
    >
      <label htmlFor="sliderA" className="pb-3 mb-2 px-12 text-sm font-medium text-gray-500 dark:text-white">
        {toDateFormat(startDate)}
      </label>
      <input
          id="sliderA"
          className={`w-4/5 absolute inset-x-20 mt-7 h-2 mb-6 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700`}
          name="min"
          type="range"
          step="1"
          min={minVal}
          max={maxVal}
          value={valueA}
          onChange={({ target }) => handleValueChange(Number(target.value))}
        />
        <div className="text-gray-500 text-base">
          Select time range:
        </div>
         
      <label htmlFor="sliderB" className="relative place-self-end pb-3 px-20 mb-2 text-sm text-gray-500 dark:text-white ">
        {toDateFormat(endDate)}
      </label>
      <input
          id="sliderB"
          className={`w-4/5 absolute inset-x-20 mt-7 h-2 mb-6 bg-blue-200/[.01] appearance-none cursor-pointer dark:bg-gray-700`}
          name="max"
          type="range"
          step="1"
          min={minVal}
          max={maxVal}
          value={valueB}
          onChange={({ target }) => handleValueChange(Number(target.value))}
        />
      </div>  
  );
};
