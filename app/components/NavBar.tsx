"use client";

import { 
  HomeIcon, 
  Cog6ToothIcon, 
  BookmarkSquareIcon, 
  QuestionMarkCircleIcon
 } from '@heroicons/react/24/outline'
 import { useAppDispatch } from "../../app/reducers/hooks";
 import { updateModal } from "../../app/reducers/userInputReducer";


const NavBar = () => {
  const dispatch = useAppDispatch() 

  return (
    <header className="absolute top-0 grid justify-items-center h-18 flex flex-wrap w-full text-sm py-0 border-b border-black shadow-md">

    <div className="grid grid-cols-10 gap-2 w-4/5 flex">

      <div className="container col-span-2 rounded-lg p-2 m-2">
        <button 
          className="text-black font-bold py-2 px-4"
          type="submit"
          // onClick={handleOnClick}
          >
          <HomeIcon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </button>
      </div>
        
      <div className="col-span-6 "> </div> 
    {/* <MySearchBar />  // col-span-6 */}

    <div className="flex flex-row-reverse col-span-2 rounded-lg py-4 m-0">
          {/* <div className="flex grow h-10 items-center  sm:justify-end sm:gap-x-7  "> */}

          <div className="container basis-1/4 flex-none rounded-lg p-0 m-0">
            <button 
              className="text-black font-bold py-2 px-4"
              type="submit"
              onClick={() => dispatch(updateModal('settings'))}
              >
              <Cog6ToothIcon
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="container basis-1/4 flex-none rounded-lg p-0 m-0">
            <button 
              className="text-black font-bold py-2 px-4"
              type="submit"
              onClick={() => dispatch(updateModal('savedSearches'))}
              >
              <BookmarkSquareIcon
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="container basis-1/4 flex-none rounded-lg p-0 m-0">
            <button 
              className="text-black font-bold py-2 px-4"
              type="submit"
              onClick={() => dispatch(updateModal('about'))}
              >
              <QuestionMarkCircleIcon
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button>
          </div>

        </div>
    </div>
    </header>
  );
}

export default NavBar;