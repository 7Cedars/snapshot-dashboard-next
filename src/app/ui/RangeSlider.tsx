"use client";

import React, { ChangeEvent } from "react";

type RangeSliderProps = {
  minVal: number;
  maxVal: number;
  minLabel?: string;
  maxLabel?: string;
  valA?: number;
  valB?: number;
  onChangeA:(input: ChangeEvent<HTMLInputElement>) => void;
  onChangeB: (input: ChangeEvent<HTMLInputElement>) => void;
  // isDisabled?: boolean;
  children: any;
};

export const RangeSlider = ({
  children,
  minVal,
  maxVal,
  minLabel = 'min', 
  maxLabel = 'max', 
  valA,
  valB,
  onChangeA, 
  onChangeB,
}: RangeSliderProps) => {
  let appearance = "flex justify-between relative w-full/[.9] p-3 m-3 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium ";
  
  return (
    
    <div className= {appearance} >
      <label htmlFor="sliderA" className="pb-3 mb-2 px-12 text-sm font-medium text-gray-500 dark:text-white">
        { minLabel }
      </label>
      <input
          id="sliderA"
          className={`w-4/5 absolute inset-x-20 mt-7 h-2 mb-6 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700`}
          name="min"
          type="range"
          step="1"
          min={minVal}
          max={maxVal}
          value={valA}
          onChange={onChangeA}
        />
        
        <div className="text-gray-500 text-base">
          { children }
        </div>
         
      <label htmlFor="sliderB" className="relative place-self-end pb-3 px-20 mb-2 text-sm text-gray-500 dark:text-white ">
      { maxLabel }
      </label>
      <input
          id="sliderB"
          className={`w-4/5 absolute inset-x-20 mt-7 h-2 mb-6 bg-blue-200/[.01] appearance-none cursor-pointer dark:bg-gray-700`}
          name="max"
          type="range"
          step="1"
          min={minVal}
          max={maxVal}
          value= {valB}
          onChange={onChangeB}
        />
      </div>  
  );
};
