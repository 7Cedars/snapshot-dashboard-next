"use client";

import { Fragment, useState, useEffect } from 'react'
import { Transition, Listbox } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon , TagIcon} from '@heroicons/react/24/outline'
import { spaces } from '../../../public/data/spacesList'
import { Space } from '../../types'
import { useSpaces } from '../hooks/useUrl';
import { ModalDialog } from '../ui/ModalDialog';
import { notification } from '@/redux/reducers/notificationReducer';
import { useAppDispatch } from '@/redux/hooks';

type listCategoryProp = {
  label: string; 
  value: string;
}

console.log("spaces: ", spaces)

const compareVotes = (a: Space, b: Space) => {
  return b.votesCount - a.votesCount
}

export const SearchDialog = () => {
  const dispatch = useAppDispatch()
  const [listCategories, setListCategories] = useState<listCategoryProp[]>([{label: 'all', value: 'all'} ])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredSpaces, setFilteredSpaces ] = useState<Space[]>(spaces.sort(compareVotes).slice(0, 50))
  const [unfilteredSpaces, setUnfilteredSpaces ] = useState<Space[]>(spaces)
  const [query, setQuery] = useState('')
  const { selectedSpaces, addSpace } = useSpaces()

  useEffect(() => {
    const queriedSpaces = spaces.filter((space:Space) => 
      space.id.includes(query) && 
      space.votesCount > 0 && 
      selectedSpaces.indexOf(space.id) === -1
    )
    setUnfilteredSpaces(queriedSpaces) 
    console.log("unfilteredSpaces: ", unfilteredSpaces)

    const uniqueCategories = Array.from(
      new Set(
        unfilteredSpaces.map((space: Space) => space.categories.flat()).flat()
        )
    )

    const listCategories = [{
      label: `all (${queriedSpaces.length})`, 
      value: 'all'
    }]
    
    uniqueCategories.forEach(
      category => {
        const filteredSpaces = queriedSpaces.filter(space => space.categories
          .includes(category) 
          )
        listCategories.push({
          label: `${category} (${filteredSpaces.length})`, 
          value: category
        }) 
      }
    )

    setListCategories(listCategories)
  
  }, [query])

  useEffect (() => {    
    let filteredSpaces = unfilteredSpaces
      .filter((space: Space) => space.categories
        .some(item => selectedCategory.includes(item))
        )
      .slice(0, 50)

    if (selectedCategory.includes('all')) {
      filteredSpaces = unfilteredSpaces.slice(0, 50)
    }

    setFilteredSpaces(filteredSpaces)
    
  }, [selectedCategory, unfilteredSpaces ]) // selectedSpaces

  const handleSelect = (spaceId: string) => {
    
    addSpace(spaceId)
    dispatch(notification({
      id: "addingSpace",
      message: `Adding DAO space: ${spaceId}`, 
      colour: "gray", 
      progressInPercent: "noProgress"
    }))

    const updateList = filteredSpaces.filter(space => space.id != spaceId) 
    setFilteredSpaces(updateList)
  }

  return (

    <ModalDialog 
      modalName = 'search'
      title = 'Search'
      subtitle = 'Search and select DAOs to analyse.'
    > 

    <div className='flex w-full'> 
      <form>
        <input
          className="p-2 flex-auto w-11/12 border text-slate-900 dark:text-slate-200 border-blue-300 dark:border-slate-600 hover:dark:border-slate-400 bg-slate-50 dark:bg-slate-800 text-sm hover:border-blue-500 outline-transparent hover:outline-transparent rounded-lg font-medium mt-4"
          type="search"
          id="mySearch"
          name="q"
          placeholder="Search and select DAOs…"
          onChange={(event) => setQuery(event.target.value)}
          />
      </form>

      {/* £bug £fix: it somehow shows a code in the list of categories. fix!  */}

      <div className="flex justify-between w-48 grid border border-blue-300 dark:border-slate-600 hover:dark:border-slate-400 bg-slate-50 dark:bg-slate-800 text-sm hover:border-blue-500 outline-transparent hover:outline-transparent rounded-lg font-medium  mt-4" > 
        <Listbox value={selectedCategory} onChange={setSelectedCategory} >
          
            <Listbox.Button className="absolute flex justify-between cursor-default p-2 w-48">
                <TagIcon
                  className="h-5 w-5 text-slate-900 dark:text-slate-300 pointer-events-none "
                  aria-hidden="true"
                />

                <div className='text-slate-900 dark:text-slate-200'> 
                  {listCategories.find(category => category.value === selectedCategory)?.label }
                </div>

              

                <ChevronDownIcon
                  className="h-5 w-5 text-slate-900 dark:text-slate-300 pointer-events-none "
                  aria-hidden="true"
                />

            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-10 z-20 max-h-60 w-48 border bg-white border-blue-500 overflow-auto rounded-lg pl-1 text-base focus:outline-none ">
                {listCategories.map((category: listCategoryProp, categoryIdx) => (
                  <Listbox.Option
                    key={categoryIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-1 pl-5 ${
                        active ? 
                        'bg-blue-100 text-blue-900' 
                        : 
                        'text-slate-900 dark:text-slate-300 bg-slate-800'
                      }`
                    }
                    value={category.value}
                    >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {category.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-0 text-blue-600">
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
          onClick={() => handleSelect(space.id)} 
        > 
          <div className={`block truncate font-medium text-slate-900 dark:text-slate-300`} >
              {space.id}
            </div>
            <div className={`block truncate font-light text-slate-900 dark:text-slate-300`} >
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