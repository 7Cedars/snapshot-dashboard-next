"use client";

import spaces from '../../../public/data/spacesList'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { useSpaces } from '../hooks/useUrl';
import { tailwindColours } from '../../../constants';

interface Props {
  key: string; 
  spaceId: string;
}

const SpaceItem = ( {spaceId}: Props) => {
  const { selectedSpaces, removeSpace } = useSpaces() 
  const appearance = `border-4 overflow-hidden flex h-14 w-14 flex-col items-center justify-center rounded-full shadow-lg`
  const space = spaces.find(space => space.id === spaceId)

  // console.log(appearance)

  return (
    spaceId !== '' ? 
    // it seems that in tailwind CSS
    // each declaration needs to be stated in hardcode, before it can be conditionally. 
    // Is this a bug? 
      <div className='
       border-red-500 
       border-orange-500  
       border-amber-500 
       border-yellow-500 
       border-lime-500 
       border-green-500 
       border-emerald-500 
       border-teal-500 
       border-cyan-500 
       border-sky-500  
       border-blue-500 
       border-indigo-500  
       border-violet-500 
       border-purple-500 
       border-fuchsia-500 
       border-pink-500 
       border-rose-500 
       border-gray-500 
       flex flex-row bg-gray-100 border w-80 rounded-lg  my-2 py-2'>
          <div className="col-span-2 flex items-center justify-center pl-2">
            
            <label className= {`${appearance} ${tailwindColours[selectedSpaces.indexOf(spaceId)]}`} >
              {/* <div className='border-red-500'> */}
            {/* // {`border-4 border-[#f87171] overflow-hidden flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white shadow-lg hover:text-white`}> */}
              <img
                className="h-14 w-14"
                aria-hidden="true"
                src={`https://cdn.stamp.fyi/space/${spaceId}?s=96`}
                alt="DAO space icon"
              />
              {/* </div >  */}
            </label>
          
          </div>
          <div className='px-1 w-48'> 
            <div className={`truncate font-medium text-base pl-3`} >
              {spaceId}
            </div>
            { space ?
              <>
                <div className={`block truncate font-light text-gray-600 pl-3`} >
                  Total votes: {space.votesCount} 
                </div>
                <div className={`block truncate font-light text-gray-600 pl-3`}>
                  {space.categories.length > 0 ? 
                    `Categories: ${space.categories.map((category: string) => category).join(", ")}`
                    : 
                    `No categories defined.`
                  }
                </div>
              </>
              : <div/> 
            }
          </div>
          
          <div className="flex items-center justify-end px-4">
            <button 
              className="font-bold"
              type="submit"
              onClick={() => removeSpace(spaceId) }
              >
                <MinusCircleIcon
                  className="h-8 w-8 text-red-400 hover:text-red-600 items-center justify-center"
                  aria-hidden="true"
                />
            </button>
          </div>
        <div/>
      <div/>
    </div>
    : 
    null 
  )
}


export default SpaceItem