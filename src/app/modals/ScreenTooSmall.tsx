"use client"

import { useRef } from "react"
import { useDimensions } from "../hooks/useDimensions"
import { useTheme } from "next-themes"


type Props = {
  height: number;  
  width: number; 
}

export const ScreenTooSmall = ({height, width}: Props ) => {
  const { systemTheme, theme, setTheme } = useTheme()

  console.log({
    heightScreenTooSmall: height, 
    widthScreenTooSmall: width
  })

  return ( 
    height < 650 || width < 1000 ? 
      <div 
        className="absolute h-full w-full z-50 flex p-6 rounded rounded-lg justify-center items-center bg-slate-50 dark:bg-slate-800"
        > 
        <div className='flex flex-col place-content-center border-2 border-red-500 rounded rounded-lg p-12'> 
         
         <img
                 className="flex justify-center self-center"
                 aria-hidden="true"
                 width={200}
                 height={200 }
                 src={theme === 'light' ? `/images/snapnetLogo.svg` : `/images/snapnetLogoDarkTheme.svg`}
                 alt="SnapnetLogo icon"
               />
         <div className='text-center text-4xl text-bold mt-6 text-slate-900 dark:text-slate-200'>
           Snapnet
         </div>
         <div className='text-center text-slate-500'>
           Visualising DAO voter networks
         </div>
         <div className="pt-12 text-center text-slate-900 dark:text-slate-200">
          This screen is too small. Please access this website from a larger screen.
          </div> 
        </div> 
      </div> 
      : 
      null
  )
}
