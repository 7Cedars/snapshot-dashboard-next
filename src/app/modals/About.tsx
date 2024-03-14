"use client";

import { Dialog, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { ModalDialog } from '../ui/ModalDialog';

export const AboutDialog = () => {

  return (

    <ModalDialog 
      modalName = 'about'
      title = 'About'
      subtitle = 'FAQ and additional information'
    > 
  
      <div className="mt-2">
        <p className="text-gray-500">
          This app shows analysis of snapshot voter behaviour. 
          MORE explanation will be inserted here... test test test test
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
      <Dialog.Title
        as="h2"
        className="pt-6 text-lg font-medium leading-6 text-slate-800 dark:text-slate-200"
      >
        FAQ
      </Dialog.Title>
      <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 py-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>What is Snapshot?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              Expanation here. (TODO)
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>What is a DAO?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                Expanation here. (TODO)
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>Why this app?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                Expanation here. (TODO)
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        </div>
  </ModalDialog>
  )
}

export default AboutDialog