"use client"; 

import TimeRangeSlider from './TimeRangeSlider';
import { useSpaces } from '../hooks/useUrl';
import { useAppDispatch } from '@/redux/hooks';
import { updateModal } from '@/redux/reducers/userInputReducer';
import SpaceItem from './SpaceItem';
import { ForceGraph } from './charts/ForceGraph';
import InfoSpaceDialog from '../modals/InfoSpace';
import { ScreenTooSmall } from '../modals/ScreenTooSmall';
import { useDimensions } from '../hooks/useDimensions';
import { useRef } from 'react';
import { useProposals } from '../hooks/useProposals';
import { useVotes } from '../hooks/useVotes';
import { useNetworkData } from '../hooks/useNetworkData';
import Link from 'next/link';

export default function Page() {
  const { selectedSpaces } = useSpaces()
  const { status: statusProposals } = useProposals()
  const { status: statusVotes } = useVotes() 
  const { status: statusNetwork } = useNetworkData() 
  const dispatch = useAppDispatch()
  const screenSize = useRef(null) 
  const {height, width} = useDimensions(screenSize)

  return ( 
    <div className="absolute top-0 h-screen w-full h-full flex flex-row space-x-0" ref = {screenSize}>
      <ScreenTooSmall height = {height} width = {width} /> 
      <InfoSpaceDialog/> 
      <div className='w-96 h-full space-y-0 pb-4 grid grid-cols-1 ps-12'> 
        <div className='mt-20 p-2 border border-slate-300 dark:border-slate-600  border-r-0 rounded-l-lg shadow-lg bg-slate-200 dark:bg-slate-800 flex flex-col overflow-auto'>

          {/* search box */}
          <form>
            <input
              className="p-2 w-full border border-blue-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm hover:border-blue-500 outline-transparent hover:outline-transparent rounded-lg font-medium "
              type="search" 
              id="mySearch"
              name="q"
              placeholder="Search and select DAOs…" 
              onClick={() => dispatch(updateModal('search'))}
              onChange={() => dispatch(updateModal('search'))}
              />
          </form>

          {/* list of selected spaces */}
          <div className='flex flex-col overflow-auto'>
          {
            selectedSpaces.length === 0 ? 
            <i className="grid justify-items-center my-4 text-slate-500"> No DAO spaces selected. </i>
            :
            selectedSpaces.map(spaceId => (
              < SpaceItem key = {spaceId} spaceId = {spaceId}/> 
            ))
          }
          </div>
        </div>
      </div>
      
      <div className='flex flex-grow space-y-0 pb-4 grid grid-cols-1 pe-12'> 
        <div className='mt-20 p-2 border border-slate-300 dark:border-slate-600 border-l-0 rounded-r-lg shadow-lg bg-slate-100 dark:bg-slate-900 flex flex-col grow'>
          
          {/* Time range slider */}
          <TimeRangeSlider/> 
          
          {/* Network Diagram */}
          <div className="mt-4 rounded-lg flex-auto"> 
            <div className='z-20 h-full w-full' > 
            {statusProposals.current == "isIdle" || 
              statusVotes.current == 'isIdle' || 
              statusNetwork.current == 'isIdle' ?  
              <div className="grid grid-cols-1 h-full w-full justify-items-start content-between text-slate-500"> 
                <div className='flex justify-items-start w-1/2 h-1/2 '> 
                  <img
                    className="rounded-lg flex w-fit h-fit "
                    src={"/images/intro.svg"}
                    alt="Loading icon"
                  />
                </div>

              <div className='flex flex-col place-content-center justify-center text-center w-full'>
                <Link 
                // Here paste link of interesting but not too large network.. 
                  href='/dashboard?d1=1680938869154&d2=1625676795108&s=deepobjects-voting.eth&s=departedapes.eth&s=deskvoting.eth&s=starsharks.com&s=manablog-org.eth&s=interleavestudios.eth&s=shreddingsassy.eth&s=omgkirby.eth' 
                  className='w-3/4 h-10 m-2 mb-12 self-center flex flex-col place-content-center text-blue-500 bg-blue-100 hover:bg-blue-200 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-500 dark:hover:border-blue-300 hover:border-blue-700 dark:bg-opacity-0 rounded rounded-lg '>
                    Feeling lazy? Load example network
                </Link>
              </div>
          
              </div>
              :
              statusProposals.current == "isLoading" || 
              statusVotes.current == 'isLoading' || 
              statusNetwork.current == 'isLoading' ?  
              <div className="flex flex-col h-full w-full justify-center items-center text-slate-500"> 
                <img
                  className="rounded-lg mx-3 animate-spin h-12 w-12 m-2"
                  src={"/images/loading.svg"}
                  alt="Loading icon"
                />
                { 
                statusProposals.current == "isLoading" ? <> Fetching proposals... </> 
                :
                statusVotes.current == "isLoading" ? <> Fetching votes... </> 
                :
                statusNetwork.current == "isLoading" ? <> Calculating network... </> 
                :
                <> Loading... </> 
                }
              </div> 
              :
              statusProposals.current == "isSuccess" && 
              statusVotes.current == 'isSuccess' && 
              statusNetwork.current == 'isSuccess' ?  
              <ForceGraph />  
              : 
              null
            }
            </div> 
          </div>
        </div>
      </div> 
    </div> 
  );
}
