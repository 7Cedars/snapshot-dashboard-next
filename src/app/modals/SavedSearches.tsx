"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useEffect, useState } from 'react';
import { SavedSearch } from '@/types';
import { toSavedSearch } from '../utils/parsers';
import { Button } from '../ui/Button';
import { useDateRange, useSpaces } from '../hooks/useUrl';
import { toFullDateFormat } from '../utils/utils';

const exampleSearch1 = {
  title: "Example search 1", 
  description: "This is an example search", 
  startDate: 1696682542396,
  endDate: 1649531843772,
  selectedSpaceIds: ["gcverseofmeta.eth", "deepobjects-voting.eth", "krap.eth", "departedapes.eth"] 
}

export const SavedSearchesDialog = () => {
  const [titleInput, setTitleInput] = useState<string>('') 
  const [descriptionInput, setDescriptionInput] = useState<string>('') 
  const { selectedSpaces } = useSpaces()
  const { d1, d2 } = useDateRange()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[] >([]) 
  const startDate = Math.min(d1, d2)
  const endDate = Math.max(d1, d2)

  console.log({
    titleInput: titleInput, 
    descriptionInput: descriptionInput
  })

  useEffect(() => {
    const searchesInStorage = toSavedSearch(localStorage.getItem('savedSearches'))
    setSavedSearches(searchesInStorage)
  }, []);

  const handleSaveSearch = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const newItem = {
      title: titleInput,  
      description: descriptionInput, 
      startDate: d1,
      endDate: d2,
      selectedSpaceIds: selectedSpaces
    }

    const newSavedSearches = [ ...savedSearches, newItem]

    localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
    setSavedSearches(newSavedSearches) 
  } 

  console.log("savedSearches: ", savedSearches)

  const handleDeleteSearch = () => {
    // TO DO 
  } 

  const handleSelectSearch = () => {
    // TO DO 
  } 

  return (

    <ModalDialog 
      modalName = 'savedSearches'
      title = 'Saved Searches'
      subtitle = 'Save and come back to previous searches here.'
    > 
    {/* Save current search box  */}
    <div className="w-full">
      <form className="m-1 p-2 grid grid-cols-4 gap-2 border-2 border-grey-600 rounded-lg ">
        <div className="col-span-4 text-md font-medium text-gray-900">  
          Save current search 
        </div>
        
        <div className='py-2 col-span-1' > 
          Title: 
        </div> 
        <input
          className="p-2 col-span-3 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
          type="text"
          id="titleSavedSearch"
          placeholder="e.g. Recent Social Dapps" 
          onChange={(event) => setTitleInput(event.target.value)}
          />
        
        <div className='col-span-1'> 
          Description: 
        </div> 
        <textarea
          className="p-2 col-span-3 border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
          id="descriptionSavedSearch"
          placeholder="e.g. This search shows the recent increase in activity of social dapps and how central X is among them." 
          onChange={(event) => setDescriptionInput(event.target.value)}
          />
        
        <div className='col-span-1'> 
          DAO Spaces: 
        </div> 
        <div className='col-span-3 grid grid-cols-12 gap-1 auto-cols-auto'> 
          {
            selectedSpaces.map(spaceId => 
              <div className= "border-2 border-gray-500 overflow-hidden flex h-8 w-8 flex-col items-center justify-center rounded-full">
              <img
                className="h-8 w-8"
                aria-hidden="true"
                src={`https://cdn.stamp.fyi/space/${spaceId}?s=96`}
                alt={`${spaceId}`}
              />
              </div>
            )
          }
        </div> 

        <div className='col-span-1'> 
          Time Range: 
        </div> 
        <div className='col-span-3'> 
          {`${toFullDateFormat(startDate)} until ${toFullDateFormat(endDate)}`}
        </div> 

        <button  
          onClick={(event: React.MouseEvent<HTMLElement>) => handleSaveSearch(event)}
          className='p-2 col-span-4 border border-blue-300 bg-blue-100 text-sm hover:border-blue-500 hover:bg-blue-300 rounded-lg font-medium '
          > 
          Save search
        </button>
      </form> 


      {/* List previous saved searches  */}
      <div className='border-2 border-green-300'> 
      <div className="col-span-4 text-md font-medium text-gray-900">  
        Saved searches 
      </div>

        { savedSearches.map(savedsearch => {
          return (
            <div> 
              {savedsearch.title} 
              {savedsearch.description}
            </div>
          )
        

          })
        }
      </div>
    </div>

  </ModalDialog>

  )
}

export default SavedSearchesDialog