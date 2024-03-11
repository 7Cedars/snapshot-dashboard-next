"use client";

import { 
  HomeIcon, 
  Cog6ToothIcon, 
  SunIcon,
  MoonIcon, 
  BookmarkSquareIcon, 
  QuestionMarkCircleIcon
 } from '@heroicons/react/24/outline'
 import { useAppDispatch } from "../redux/hooks";
 import { updateModal } from "../redux/reducers/userInputReducer";
 import { notification } from '@/redux/reducers/notificationReducer';
 import Link from 'next/link';
 import { NotificationDialog } from './ui/NotificationDialog';
import { useEffect } from 'react';
import ThemeToggle from './ui/ThemeToggle';

const NavBar = ( ) => {
  const dispatch = useAppDispatch() 

  useEffect(() =>{ 
    console.log("window.document.documentElement.classList: ", window.document.documentElement.classList)
    window.document.documentElement.classList.remove("dark")
    window.document.documentElement.classList.add("light")
  }, [])

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      // document.documentElement.classList.add('dark')
    // } else {
    //   document.documentElement.classList.remove('dark')
    // }

    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = 'light'

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = 'dark'

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme')

  return (
    <header className="absolute top-0 grid h-16 justify-items-center flex flex-wrap w-full text-sm py-0 border-b border-black shadow-md z-20">

    <div className="flex w-4/5 m-2">
   
        <div className='flex-none flex items-center justify-center'> 
          <Link href='/' className='text-black hover:text-blue-800 font-bold w-fit h-fit'>
            <HomeIcon
              className="h-7 w-7 self-center"
              aria-hidden="true"
            /> 
          </Link>
      </div>
        
      <div className="grow px-12"> 
        <NotificationDialog /> 
      </div> 


    <div className="flex items-center ">
          {/* <div className="flex grow h-10 items-center  sm:justify-end sm:gap-x-7  "> */}
          <div className="flex-none w-fit h-fit items-center justify-center">
            <button 
              className="text-black hover:text-blue-800 font-bold m-2"
              type="submit"
              onClick={() => dispatch(updateModal('about'))}
              >
                FAQ
              {/* <QuestionMarkCircleIcon
                className="h-7 w-7"
                aria-hidden="true"
              /> */}
            </button>
          </div>

          <div className="flex-none w-fit items-center">
            <button 
              className="text-black hover:text-blue-800 font-bold py-2 px-4"
              type="submit"
              onClick={() => dispatch(updateModal('savedSearches'))}
              >
                Saved Searches
              {/* <BookmarkSquareIcon
                className="h-7 w-7"
                aria-hidden="true"
              /> */}
            </button>
          </div>

          <div className="flex-none w-fit items-center">
            <ThemeToggle /> 
            {/* <button 
              className="text-black hover:text-blue-800 font-bold py-2 px-4 border-"
              type="submit"
              // onClick={() => dispatch(updateModal('settings'))} 
              >
              <SunIcon
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button> */}
          </div>
        </div>
    </div>
    </header>
  );
}

export default NavBar;