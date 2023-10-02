"use client";

import { Fragment, useState, useEffect } from 'react'
import { Transition, Listbox } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { ChevronDownIcon, CheckIcon , TagIcon} from '@heroicons/react/24/outline'
import spaces from '../../../public/data/spacesList'
import { Space } from '../../types'
import { useSpaces } from '../hooks/useUrl';
import { ModalDialog } from '../ui/ModalDialog';

const compareVotes = (a: Space, b: Space) => {
  return b.votesCount - a.votesCount
}

const listCategories = Array.from(
  new Set(
    spaces.map((space: Space) => space.categories.flat() ).flat()
    )
  ) 
listCategories.push('all')

console.log("listCategories: ", listCategories ) 

export const SearchDialog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all'])
  const [filteredSpaces, setFilteredSpaces ] = useState<Space[]>(spaces.sort(compareVotes).slice(0, 50))
  const [query, setQuery] = useState('')
  const { selectedSpaces, addSpace } = useSpaces()

  const [valueA, setValueA] = useState(10)
  const [valueB, setValueB] = useState(40)

  // const handleSelection = (space: Space) => {
  
    // addSpace(space)

  //   let firstFilter = spaces.filter((space: Space) => 
  //     space.categories.some(item => selectedCategory.includes(item))
  //   )

  //   if (selectedCategory.includes('all')) {firstFilter = spaces}

  //   const secondFilter = firstFilter.filter((space: Space) => 
  //     selectedSpaces.indexOf(space.id) === -1 
  //   ) 

  //   if (query.length > 0) {
  //     const thirdFilter = secondFilter.filter((space:Space) => 
  //       space.id.includes(query))
  //     setFilteredSpaces(thirdFilter.slice(0, 50)) 
  //   } else {
  //     setFilteredSpaces(secondFilter.slice(0, 50))
  //   }
  // } 

  useEffect (() => {
    
    let firstFilter = spaces.filter((space: Space) => 
      space.categories.some(item => selectedCategory.includes(item))
    )

    if (selectedCategory.includes('all')) {firstFilter = spaces}

    const secondFilter = firstFilter.filter((space: Space) => 
      selectedSpaces.indexOf(space.id) === -1 
    ) 

    if (query.length > 0) {
      const thirdFilter = secondFilter.filter((space:Space) => 
        space.id.includes(query))
      setFilteredSpaces(thirdFilter.slice(0, 50)) 
    } else {
      setFilteredSpaces(secondFilter.slice(0, 50))
    }

  }, [selectedCategory, query ]) // selectedSpaces

  return (

    <ModalDialog 
      modalName = 'search'
      title = 'Search'
      subtitle = 'Search and select DAOs to analyse.'
    > 

    <div className='flex'> 
      <form>
        <input
          className="p-2 flex-auto w-11/12 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium mt-4"
          type="search"
          id="mySearch"
          name="q"
          placeholder="Search and select DAOs…"
          onChange={(event) => setQuery(event.target.value)}
          />
      </form>

      <div className="flex justify-between w-48 grid border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium mt-4" > 
        <Listbox value={selectedCategory} onChange={setSelectedCategory} >
          
            <Listbox.Button className="absolute flex justify-between cursor-default p-2 w-48">
                <TagIcon
                  className="h-5 w-5 text-black pointer-events-none "
                  aria-hidden="true"
                />

              {selectedCategory}

                <ChevronDownIcon
                  className="h-5 w-5 text-black pointer-events-none "
                  aria-hidden="true"
                />

            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-10 z-10 pr-9 max-h-60 border bg-white border-blue-500 overflow-auto rounded-lg py-1 text-base focus:outline-none ">
                {listCategories.map((category: string, categoryIdx) => (
                  <Listbox.Option
                    key={categoryIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={category}
                    >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {category}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
        </Listbox>
        </div>
      </div>

    <div className='overflow-auto max-h-96 pl-0 mt-5'> 
      {filteredSpaces.map(space => (
        <div key = {space.id} > 
        <button 
          className='border border-blue-300 rounded-lg p-2 mr-1 my-2 w-96 grid justify-items-start'
          onClick={() => addSpace(space)} 
        > 
          <div className={`block truncate font-medium`} >
              {space.id}
            </div>
            <div className={`block truncate font-light`} >
              Total votes: {space.votesCount} 
              {space.categories.length > 0 ? 
              ` | ${
              space.categories.map(category => category).join(", ")
              }`
              : 
            null
            }
            </div>
        </button> 
        </div> 
      ))}
    </div>
  </ModalDialog>

  )
}

export default SearchDialog