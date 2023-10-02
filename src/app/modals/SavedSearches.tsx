"use client";

import { ModalDialog } from '../ui/ModalDialog';

export const SavedSearchesDialog = () => {

  return (

    <ModalDialog 
      modalName = 'savedSearches'
      title = 'Saved Searches'
      subtitle = 'Save and come back to previous searches here.'
    > 

    <div className="mt-2">
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