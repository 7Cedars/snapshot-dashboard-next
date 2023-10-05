"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useEffect, useState } from 'react';
import { SavedSearch } from '@/types';
import { toSavedSearch } from '../utils/parsers';
import { Button } from '../ui/Button';
import { useDateRange, useSpaces } from '../hooks/useUrl';

export const SavedSearchesDialog = () => {

  const [titleInput, setTitleInput] = useState<string>('') 
  const [descriptionInput, setDescriptionInput] = useState<string>('') 
  const [savedSearches, setSavedSearches] = useState<SavedSearch[] >([]) 
  const [searchesToShow, setSearchesToShow ] = useState<SavedSearch[] >([]) 
  const { selectedSpaces } = useSpaces()
  const { d1, d2 } = useDateRange()

  console.log({
    titleInput: titleInput, 
    descriptionInput: descriptionInput
  })

  useEffect(() => {
    // localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    setSearchesToShow([toSavedSearch(localStorage.getItem('savedSearches'))])
  }, [savedSearches]);

  console.log("savedSearches: ", savedSearches)

  useEffect(() => {
    const test = toSavedSearch(localStorage.getItem('savedSearches')) 
    console.log(test)
  }, []);

  const handleSaveSearch = () => {
    const newItem = {
      title: titleInput,  
      description: descriptionInput, 
      startDate: d1,
      endDate: d2,
      selectedSpaceIds: selectedSpaces
    }

    localStorage.setItem('savedSearches', JSON.stringify([ ...savedSearches, newItem]));
    // setSavedSearches([ ...savedSearches, newItem]) 
  } 

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

    <div className="mt-2">
      <form className="mt-2 border-2 border-red-600 flex-col ">
        <div>  Save current search </div>

        <div> 
          Title: 
          <input
            className="p-2 flex-grow border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
            type="text"
            id="titleSavedSearch"
            placeholder="e.g. Recent Social Dapps" 
            onChange={(event) => setTitleInput(event.target.value)}
            />
        </div>

        <div className='flex-row'> 
          Description: 
          <textarea
            className="p-2 flex-grow border border-blue-300 text-sm hover:border-blue-500 rounded-lg font-medium "
            id="descriptionSavedSearch"
            placeholder="e.g. This search shows the recent increase in activity of social dapps and how central X is among them." 
            onChange={(event) => setDescriptionInput(event.target.value)}
            />
        </div>
        <Button onClick={() => handleSaveSearch()} >
            Save Search
        </Button>  
      </form> 


        <p className="text-gray-500">
          This app shows analysis of snapshot voter behaviour. 
          MORE explanation will be inserted here... 
        </p>
        <p className="text-gray-500">
          This app shows analysis of snapshot voter behaviour. 
          MORE explanation will be inserted here... 
        </p>
        <p className="text-gray-500">
          This app shows analysis of snapshot voter behaviour. 
          MORE explanation will be inserted here... 
        </p>
        <p className=" text-gray-500">
          This app shows analysis of snapshot voter behaviour. 
          MORE explanation will be inserted here... 
        </p>
      </div>

  </ModalDialog>

  )
}

export default SavedSearchesDialog