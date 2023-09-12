"use client";

import { Fragment } from 'react'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { updateModal } from '../../../redux/reducers/userInputReducer'
import { XMarkIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export const AboutDialog = () => {
  const dispatch = useAppDispatch()
  const { modal } = useAppSelector(state => state.userInput)

  return (
   
    <Transition appear show={(modal === 'about')} as={Fragment}>
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
                className="text-black font-bold pt-2 px-2"
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
                <p> About </p>
              </Dialog.Title>
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
                className="pt-6 text-lg font-medium leading-6 text-gray-900"
              >
                FAQ
              </Dialog.Title>
              <div className="w-full rounded-2xl bg-white py-2">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="border border-blue-500 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
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
                      <Disclosure.Button className="border border-blue-500 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
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
                      <Disclosure.Button className="border border-blue-500 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  )
}

export default AboutDialog