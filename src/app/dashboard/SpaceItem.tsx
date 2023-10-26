"use client";

import spaces from '../../../public/data/spacesList'
import { MinusCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useSpaces } from '../hooks/useUrl';
import { tailwindColours } from '../../../constants';
import { useAppDispatch } from '@/redux/hooks';
import { notification } from '@/redux/reducers/notificationReducer';
import { updateModal } from '@/redux/reducers/userInputReducer';

interface Props {
  key: string; 
  spaceId: string;
}


const SpaceItem = ( {spaceId}: Props) => {
  const { selectedSpaces, removeSpace } = useSpaces() 
  const space = spaces.find(space => space.id === spaceId)
  const dispatch = useAppDispatch()

  const handleRemoveSpace = (spaceId: string) => {
    const numberOfSpaces = selectedSpaces.length 
    removeSpace(spaceId)
    dispatch(notification({
      id: "spaceRemoved", 
      message: `removing DAO space: ${spaceId}`, 
      colour: "yellow"
    }))
  } 

  return (
    spaceId !== '' ? 
      <div className='border-gray-500 flex flex-row bg-gray-100 border grow rounded-lg my-1 py-2 divide-x-2 '>
        <div className='flex grow'> 
          <div className="flex items-center justify-center pl-1 ">
            <label className= {`border-4 overflow-hidden flex h-14 w-14 flex-col items-center justify-center rounded-full shadow-lg ${tailwindColours[selectedSpaces.indexOf(spaceId)]}`} >
              <img
                className="h-14 w-14"
                aria-hidden="true"
                src={`https://cdn.stamp.fyi/space/${spaceId}?s=96`}
                alt="DAO space icon"
              />
            </label>
          </div>

          <div className='px-1 grow text-xs'> 
            <div className={`truncate font-medium text-sm pl-1`} >
              {spaceId}
            </div>
            { space ?
              <>
                <div className={`block truncate font-light text-gray-600 pl-1`} >
                  Total votes: {space.votesCount} 
                </div>
                <div className={`block truncate font-light text-gray-600 pl-1`}>
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
        </div>

          <div className="flex items-center justify-end pe-6">
            <button 
              className="font-bold px-1"
              type="submit"
              onClick={() => handleRemoveSpace(spaceId) }
              >
                <MinusCircleIcon
                  className="h-8 w-8 text-red-400 hover:text-red-600 items-center justify-center"
                  aria-hidden="true"
                />
            </button>
            <button 
              className="font-bold"
              type="submit"
              onClick={() => dispatch(updateModal('infoSpace'))}
              >
                <InformationCircleIcon
                  className="h-8 w-8 text-gray-400 hover:text-gray-600 items-center justify-center"
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