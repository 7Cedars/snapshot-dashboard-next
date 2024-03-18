"use client";

import { 
  HomeIcon, 
 } from '@heroicons/react/24/outline'
 import { useAppDispatch } from "../redux/hooks";
 import { updateModal } from "../redux/reducers/userInputReducer";
 import { notification } from '@/redux/reducers/notificationReducer';
 import Link from 'next/link';
 import { NotificationDialog } from './ui/NotificationDialog';
import { useEffect, useRef } from 'react';
import ThemeToggle from './ui/ThemeToggle';
import { useDimensions } from './hooks/useDimensions';

const NavBar = ( ) => {
  const dispatch = useAppDispatch() 
  const navBarSize = useRef(null)
  const {height, width} = useDimensions(navBarSize)

  return (
    <header className="absolute top-0 grid h-16 justify-items-center flex flex-wrap w-full text-sm py-0 border-b border-slate-800 dark:border-slate-400 shadow-md z-20" ref = {navBarSize}>

    <div className="flex w-4/5 m-2">
   
        <div className='flex-none flex items-center justify-center'> 
          <Link href='/' className='text-slate-800 dark:text-slate-400 hover:text-blue-500 font-bold w-fit h-fit'>
            <HomeIcon
              className="h-7 w-7 self-center"
              aria-hidden="true"
            /> 
          </Link>
      </div>
        
      <div className="grow px-12"> 
        <NotificationDialog /> 
      </div> 


    <div className="flex items-center text-slate-800 dark:text-slate-400 ">
          {/* <div className="flex grow h-10 items-center  sm:justify-end sm:gap-x-7  "> */}
          <div className="flex-none w-fit h-fit items-center justify-center">
            <button 
              className="hover:text-blue-500 m-2 px-2"
              type="submit"
              onClick={() => dispatch(updateModal('about'))}
              >
                FAQ
            </button>
          </div>

          { width < 1000 ? 
          <div className="flex-none w-fit items-center" />
          :
          <div className="flex-none w-fit items-center">
            <button 
              className="hover:text-blue-500 pe-4"
              type="submit"
              onClick={() => dispatch(updateModal('savedSearches'))}
              >
                Saved Searches
            </button>
          </div>              
          } 
          <div className="flex-none w-fit items-center border-s border-slate-800 dark:border-slate-400 ">
            <ThemeToggle /> 
          </div>
        </div>
    </div>
    </header>
  );
}

export default NavBar;