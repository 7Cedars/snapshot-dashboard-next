"use client";

import { Dialog, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { ModalDialog } from '../ui/ModalDialog';
import Link from 'next/link';

export const AboutDialog = () => {

  return (

    <ModalDialog 
      modalName = 'about'
      title = 'About'
      subtitle = 'Snapnet maps voting behaviour of DAO members on Snapshot.'
    > 
      <div className="mt-2">
        <p className="text-gray-500 my-2">
          Building on Snapshot's API, Snapnet creates a network graph. In this graph DAO's are nodes and shared voters are links.  
          In other words, whenever a single blockchain address voted for a proposal in two different DAO's, a link between the two exists. 
        </p>
        <p className="text-gray-500 my-2">
        </p>
        <p className="text-gray-500 my-2">
          Wider links between DAOs mean more shared voters, larger size nodes mean more votes overall.
        </p>
        <p className=" text-gray-500">
          The user selects what DAO's are mapped, across which time period. It is also possible to select a single DAO and get more detail about the DAO itself and voting behaviour of its community.
        </p>
      </div>
      <Dialog.Title
        as="h2"
        className="pt-6 text-lg font-medium leading-6 text-slate-800 dark:text-slate-200"
      >
        Frequently Asked Questions
      </Dialog.Title>
      <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 py-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>What on earth is a DAO?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              DAO is an abbreviation for Decentralized Autonomous Organization. 
              As per <Link href= {"https://en.wikipedia.org/wiki/Decentralized_autonomous_organization"} className='text-blue-500 underline'> Wikipedia</Link>: 
              'a DAO is an organization managed in whole or in part by decentralized computer program, with voting and finances handled through a blockchain. 
              In general terms, DAOs are member-owned communities without centralized leadership.'
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>What is SnapShot?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <Link href = {"https://docs.snapshot.org/introduction"} className='text-blue-500 underline'> In their own words, </Link> 
                'Snapshot is a voting platform that allows DAOs, DeFi protocols, or NFT communities to vote easily and without gas fees. 
                [...] 
                It is an off-chain gasless multi-governance client which results are easy to verify and hard to contest.'
                In other words, it allows DAOs to vote on proposals outside the blockchain, which means that community members do not have to pay gas fees to vote.  
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>Is this app affiliated with SnapShot?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                No, nope, nee: This app is in no shape, way or form affiliated with Snapshot.   
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="border border-blue-500 dark:hover:border-blue-300 flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 dark:bg-opacity-0">
                <span>X, Y or Z does not seem to work properly! How come?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <p className='my-2'> 
                  This app is under active development. 
                  Also, it is the outcome of a learning project and trajectory. 
                  So, please, give me a bit of slack as I was learning GraphQL, tailwind css, redux while getting to grips with the DAO space. 
                  At times, the app can - and definitely will! - break or exhibit weird behaviour. 
                </p>
                <p className='my-2'>
                  Some known issues: 
                </p>
                <ul className='list-disc list-inside'>
                  <li> 
                    Only proposals with fewer than a throudand votes are mapped.
                    This means that a DAO with many total votes can still end up being mapped as small with few links.   
                  </li>
                  <li> 
                    Vote numbers in the detailed DAO are often incorrect.  
                  </li>
                </ul>
                <p  className='my-2'>
                For more open issues, please see the <Link href={'https://github.com/7Cedars/snapshot-dashboard-next'} className='text-blue-500 underline'> github repository</Link>.  
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        </div>
  </ModalDialog>
  )
}

export default AboutDialog