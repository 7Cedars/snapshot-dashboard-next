"use client";

import { Fragment } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { updateModal, setDarkMode, setDeveloperMode } from '../../redux/reducers/userInputReducer'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const SettingsDialog = () => {
  const dispatch = useAppDispatch()
  const { settings, modal } = useAppSelector(state => state.userInput)

  return (
   
    <Transition appear show={(modal === 'settings')} as={Fragment}>
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
                <p> Settings </p>
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-gray-500">
                  Adjust colour scheme, notifications and more. 
                </p>
              </div>
              <div className="flex items-center justify-between text-gray-500 pt-8">
                Enable developer mode: 
                <Switch
                  checked={settings.developerMode}
                  onChange={(change1) => dispatch(setDeveloperMode(change1))}
                  className={`mx-2 ${settings.developerMode ? 'bg-blue-500' : 'bg-blue-200'}
                    relative border border-blue-500 inline-flex h-[21px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${settings.developerMode ? 'translate-x-6' : 'translate-x-0'}
                      pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
                </div>

                <div className="flex items-center justify-between text-gray-500 pt-4">
                Enable dark mode: 
                <Switch
                  checked={settings.darkMode}
                  onChange={(change2) => dispatch(setDarkMode(change2))}
                  className={`mx-2 ${settings.darkMode ? 'bg-blue-500' : 'bg-blue-200'}
                    relative border border-blue-500 inline-flex h-[21px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}
                      pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  )
}

export default SettingsDialog