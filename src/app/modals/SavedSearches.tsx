"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useEffect, useState, FormEventHandler, FormEvent } from 'react';
import { SavedSearch } from '@/types';
import { toSavedSearch } from '../utils/parsers';
import { Button } from '../ui/Button';
import { useDateRange, useSpaces } from '../hooks/useUrl';
import { toFullDateFormat } from '../utils/utils';
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const exampleSearch1 = {
  title: "Example", 
  description: "This is the default example search.", 
  startDate: 1680938869154,
  endDate: 1625676795108,
  selectedSpaceIds: ["deepobjects-voting.eth", "departedapes.eth", "deskvoting.eth", "starsharks.com", "manablog-org.eth", "interleavestudios.eth", "shreddingsassy.eth", "omgkirby.eth"] 
}

export const SavedSearchesDialog = () => {
  const [titleInput, setTitleInput] = useState<string>('') 
  const [descriptionInput, setDescriptionInput] = useState<string>('') 
  const { selectedSpaces, loadSavedSearch } = useSpaces()
  const { d1, d2 } = useDateRange()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[] >([]) 
  const startDate = Math.min(d1, d2)
  const endDate = Math.max(d1, d2)

  // console.log({
  //   titleInput: titleInput, 
  //   descriptionInput: descriptionInput
  // })

  useEffect(() => {
    try { 
      let searchesInStorage = toSavedSearch(localStorage.getItem('savedSearches'))
      setSavedSearches(searchesInStorage)
    } catch (error) {
      setSavedSearches([exampleSearch1])
    }
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

  // console.log("savedSearches: ", savedSearches)

  const handleDeleteSearch = (savedSearch: any, event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    const newSavedSearches = savedSearches.filter(item => item.title !== savedSearch.title)

    const isConfirmed = confirm("Are you sure you want to remove this saved search? You will not be able to recover it.");

    if (isConfirmed) {
      localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
      setSavedSearches(newSavedSearches) 
    }
  } 

  const handleSelectSearch = (savedSearch: SavedSearch, event: React.FormEvent<HTMLElement>) => {
    event.preventDefault

    loadSavedSearch(
      savedSearch.selectedSpaceIds, 
      String(savedSearch.startDate), 
      String(savedSearch.endDate)
    )
  } 

  return (

    <ModalDialog 
      modalName = 'savedSearches'
      title = 'Saved Searches'
      subtitle = 'Save and come back to previous searches here.'
    > 
   
    <div className="w-full h-full">
      {/* Save current search box  */}
      <div className="col-span-4 text-md font-medium flex my-2 justify-center text-slate-500">  
          Save current search 
      </div>
      <form className="m-1 p-2 grid grid-cols-4 gap-2 border border-slate-500 rounded-lg">  
        <div className='py-2 col-span-1 text-slate-900 dark:text-slate-300' > 
          Title: 
        </div> 
        <input
          className="p-2 col-span-3 border dark:border-slate-600 dark:hover:border-slate-400  bg-slate-50 dark:bg-slate-800 text-sm hover:border-blue-500 outline-transparent hover:outline-transparent rounded-lg font-medium "
          type="text"
          id="titleSavedSearch"
          placeholder="e.g. Recent Social Dapps" 
          onChange={(event) => setTitleInput(event.target.value)}
          />
        
        <div className='col-span-1 text-slate-900 dark:text-slate-300'> 
          Description: 
        </div> 
        <textarea
          className="p-2 col-span-3 border dark:border-slate-600 dark:hover:border-slate-400  bg-slate-50 dark:bg-slate-800 text-sm hover:border-blue-500 outline-transparent hover:outline-transparent rounded-lg font-medium"
          id="descriptionSavedSearch"
          placeholder="e.g. This search shows the recent increase in activity of social dapps and how central X is among them." 
          onChange={(event) => setDescriptionInput(event.target.value)}
          />
        
        <div className='col-span-1 text-slate-900 dark:text-slate-300'> 
          DAO Spaces: 
        </div> 
        <div className='col-span-3 grid grid-cols-12 gap-1 auto-cols-auto'> 
          {
            selectedSpaces.map(spaceId => 
              <div className= "border-2 overflow-hidden border-gray-500 flex h-8 w-8 flex-col items-center justify-center rounded-full" key = {spaceId}>
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

        <div className='col-span-1 text-slate-900 dark:text-slate-300'> 
          Time Range: 
        </div> 
        <div className='col-span-3 text-slate-900 dark:text-slate-300'> 
          {`${toFullDateFormat(startDate)} until ${toFullDateFormat(endDate)}`}
        </div> 

        <button  
          onClick={(event: React.MouseEvent<HTMLElement>) => handleSaveSearch(event)}
          className='p-2 m-4 col-span-4 h-10 border text-blue-500 bg-blue-100 hover:bg-blue-200 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-500 dark:hover:border-blue-300 hover:border-blue-700 dark:bg-opacity-0 rounded rounded-lg'
          > 
          Save search
        </button>
      </form> 


      {/* List previous saved searches  */}
      <> 
      <div className="text-md font-medium text-slate-500 w-full flex justify-center overflow-auto mt-6 mb-2">  
        Saved searches 
      </div>

        { savedSearches.map(savedsearch => {
          return (
            <div className='grid grid-cols-4 gap-1 border border-gray-500 rounded-lg m-1 p-2' key = {savedsearch.title} > 
              <div className='col-span-4 flex justify-end '> 
                <button 
                  className="text-slate-900 dark:text-slate-300 font-bold pt-1 px-1"
                  type="submit"
                  onClick={(event) => handleDeleteSearch(savedsearch, event)}
                  >
                  <XMarkIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            <div className='col-span-4 text-md font-medium text-slate-900 dark:text-slate-300 mb-0'>
              {savedsearch.title} 
            </div> 
            <div className='col-span-4 text-gray-500 mb-4'> 
              {savedsearch.description}  
            </div> 
          
              <div className='col-span-1 text-slate-900 dark:text-slate-300'> 
                DAO Spaces: 
              </div> 
              <div className='col-span-3 grid grid-cols-12 gap-1 auto-cols-auto'> 
                {
                  savedsearch.selectedSpaceIds.map(spaceId => 
                    <div className= "border-2 overflow-hidden  border-gray-500 flex h-8 w-8 flex-col items-center justify-center rounded-full" key = {spaceId} >
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
              <div className='col-span-1 text-slate-900 dark:text-slate-300'> 
                Time Range: 
              </div> 
              <div className='col-span-3 text-slate-900 dark:text-slate-300'> 
                {`${toFullDateFormat(savedsearch.startDate)} until ${toFullDateFormat(savedsearch.endDate)}`}
              </div> 

              <button  
                type = 'button'
                onClick={(event) => handleSelectSearch(savedsearch, event)}
                className='p-2 mt-4 col-span-4 border border-green-400 text-sm text-green-400 hover:bg-green-100 hover:bg-green-300 dark:hover:text-green-200 dark:hover:border-green-200  rounded-lg font-medium dark:bg-opacity-0'
                > 
                Select search
              </button>
            </div>
          )
        

          })
        }
      </>
    </div>

  </ModalDialog>

  )
}

export default SavedSearchesDialog