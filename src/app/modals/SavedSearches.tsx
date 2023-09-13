"use client";

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { updateModal } from '../../redux/reducers/userInputReducer'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const SavedSearchesDialog = () => {
  const dispatch = useAppDispatch()
  const { modal } = useAppSelector(state => state.userInput)

  return (
   
    <Transition appear show={(modal === 'savedSearches')} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={() => dispatch(updateModal('none'))}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-max min-w-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            
            <div className='flex justify-end '> 
              <button 
                className="text-black font-bold py-2 px-4"
                type="submit"
                onClick={() => dispatch(updateModal('none'))}
                >
                <XMarkIcon
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              </button>
            </div>
              <Dialog.Title
                as="h2"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                <p> Saved Searches </p>
              </Dialog.Title>
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  )
}

export default SavedSearchesDialog