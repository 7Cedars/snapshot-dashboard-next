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

  return (
    <>
    <div className= "grid grid-cols-1 h-14 bg-white w-full px-6 m-0 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium " >
     
     {/* Labels  */}
     <div className="flex flex-row justify-between w-full "> 
        <label htmlFor="sliderA" className=" flex-none w-16 pt-2 text-sm font-medium text-gray-500">
          { minLabel }
        </label>

        <div className="text-gray-900 text-base text-md  flex align-items-center pt-2 ">
          { children }
        </div>

        <label htmlFor="sliderB" className=" flex-none w-16 pt-2 text-sm text-gray-500">
        { maxLabel }
        </label>
      </div>

      {/* Slider  */}
        <div className="flex flex-row justify-center relative "> 
          <input
              id="sliderA"
              className={`w-full absolute inset-x-0 px-4 h-1 mb-12 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700`}
              name="min"
              type="range"
              step="1"
              min={minVal}
              max={maxVal}
              value={valA}
              onChange={onChangeA}
              
            />        
                 {/* <input
              id="sliderB"
              className={`absolute inset-x-[400px] px-4 h-1 mb-12 bg-green-200 appearance-none cursor-pointer dark:bg-gray-700`}
              name="max"
              type="range"
              step="1"
              min={valA}
              max={valB}
              value= {valB}
            /> */}
          <input
              id="sliderB"
              className={`w-full absolute inset-x-0 px-4 h-1 mb-12 bg-blue-200/[.01] appearance-none cursor-pointer dark:bg-gray-700`}
              name="max"
              type="range"
              step="1"
              min={minVal}
              max={maxVal}
              value= {valB}
              onChange={onChangeB}
            />
       
        </div>
      </div> 
    </>  
  );
};
