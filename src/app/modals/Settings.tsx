"use client";

import { Switch } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setDarkMode, setDeveloperMode } from '../../redux/reducers/userInputReducer'
import { ModalDialog } from '../ui/ModalDialog';

export const SettingsDialog = () => {
  const dispatch = useAppDispatch()
  const { settings } = useAppSelector(state => state.userInput)

  return (

    <ModalDialog 
      modalName = 'settings'
      title = 'Settings'
      subtitle = 'Adjust colour scheme, notifications and more. '
    > 

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

    </ModalDialog>

  )
}

export default SettingsDialog