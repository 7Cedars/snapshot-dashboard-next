"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useEffect, useState, FormEventHandler, FormEvent } from 'react';
import { SavedSearch } from '@/types';
import { toSavedSearch } from '../utils/parsers';
import { Button } from '../ui/Button';
import { useDateRange, useSpaces } from '../hooks/useUrl';
import { toFullDateFormat } from '../utils/utils';
import React from 'react';

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
  const { d1, d2, handleDates } = useDateRange()
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

  const handleDeleteSearch = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    // TO DO 
  } 

  const handleSelectSearch = (savedSearch: any, event: React.FormEvent<HTMLElement>) => {
    event.preventDefault
    console.log("at handleSelectSearch: ", savedSearch)
    
    // handleDates(String(), String()) 
  } 

  return (

    <ModalDialog 
      modalName = 'savedSearches'
      title = 'Saved Searches'
      subtitle = 'Save and come back to previous searches here.'
    > 
   
    <div className="w-full overflow-auto h-full">
      {/* Save current search box  */}
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
              <div className= "border-2 border-gray-500 flex h-8 w-8 flex-col items-center justify-center rounded-full">
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
      <> 
      <div className="text-md font-medium text-gray-900 w-full overflow-auto">  
        Saved searches 
      </div>

        { savedSearches.map(savedsearch => {
          return (
            <form className='col-span-4 grid grid-cols-4 gap-2 border border-gray-500 rounded-lg m-1 p-2' 
              onSubmit={(event) => handleSelectSearch(savedsearch, event)}> 
              <div className="col-span-1 text-md font-medium text-gray-900">  
                Title: 
              </div>
              <div className='col-span-3' id='title'> 
                {savedsearch.title} 
              </div>

              <div className="col-span-1 text-md font-medium text-gray-900">  
                  Description:  
              </div> 
              <input className='col-span-3' value={savedsearch.description} id='description'/> 
              <div className='col-span-1'> 
                DAO Spaces: 
              </div> 
              <div className='col-span-3 grid grid-cols-12 gap-1 auto-cols-auto'> 
                {
                  savedsearch.selectedSpaceIds.map(spaceId => 
                    <div className= "border-2 border-gray-500 flex h-8 w-8 flex-col items-center justify-center rounded-full">
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
                {`${toFullDateFormat(savedsearch.startDate)} until ${toFullDateFormat(savedsearch.endDate)}`}
              </div> 

              <button  
                // onClick={(event: FormEvent<HTMLElement>) => handleSelectSearch(event)}
                type = 'submit'
                className='p-2 col-span-2 border border-green-300 bg-green-100 text-sm hover:border-green-500 hover:bg-green-300 rounded-lg font-medium'
                > 
                Select search
              </button>
              <button
                id = {String(savedsearch.selectedSpaceIds)}
                type = 'submit'
                className='p-2 col-span-2 border border-red-300 bg-red-100 text-sm hover:border-red-500 hover:bg-red-300 rounded-lg font-medium '
                > 
                Delete search
              </button>

            </form>
          )
        

          })
        }
      </>
    </div>

  </ModalDialog>

  )
}

export default SavedSearchesDialog