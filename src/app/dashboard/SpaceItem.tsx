"use client";

import { spaces } from '../../../public/data/spacesList'
import { MinusCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSpaces } from '../hooks/useUrl';
import { colourCodes, tailwindColours } from '../../../constants';
import { useAppDispatch } from '@/redux/hooks';
import { notification } from '@/redux/reducers/notificationReducer';
import { updateModal } from '@/redux/reducers/userInputReducer';

interface Props {
  key: string; 
  spaceId: string;
}

export const borderColours = [
  `border-gray-500`, 
  `border-red-500`, 
  `border-orange-500`,  
  `border-amber-500`,
  `border-yellow-500`, 
  `border-lime-500`,
  `border-green-500`,
  `border-emerald-500`,
  `border-teal-500`,
  `border-cyan-500`,
  `border-sky-500`, 
  `border-blue-500`,
  `border-indigo-500`, 
  `border-violet-500`,
  `border-purple-500`,
  `border-fuchsia-500`,
  `border-pink-500`,
  `border-rose-500`
]

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
      colour: "yellow", 
      progressInPercent: "noProgress"
    }))
  }
// + tailwindColours[selectedSpaces.indexOf(spaceId)]

  return (
    spaceId !== '' ? 
      <div className='border-gray-500 flex flex-row items-center bg-gray-100 border grow rounded-lg my-1 py-1  '> 
        <button 
          className='flex grow'
          type="submit"
          onClick={() => dispatch(updateModal('infoSpace'))}
          > 
          <div className="flex items-start justify-start pl-2 ">
            <label className= {`border-4 overflow-hidden flex h-12 w-12 flex-col items-start justify-start rounded-full shadow-lg ${borderColours[selectedSpaces.indexOf(spaceId) % 18]}`} >
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
        </button>

          <div className="flex items-center justify-end pe-2">
          {/* <div className="grid grid-cols-1 divide-y-2 items-center justify-end pe-2 opacity-0 hover:opacity-100"> */}
            {/* <button 
              className="font-bold"
              type="submit"
              onClick={() => dispatch(updateModal('infoSpace'))}
              >
                <InformationCircleIcon
                  className="h-6 w-6 text-gray-300 hover:text-gray-500 items-center justify-center"
                  aria-hidden="true"
                />
            </button> */}
            <button 
              className="font-bold px-1"
              type="submit"
              onClick={() => handleRemoveSpace(spaceId) }
              >
                <MinusCircleIcon
                  className="h-6 w-6 text-red-300 hover:text-red-700 items-center justify-center"
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