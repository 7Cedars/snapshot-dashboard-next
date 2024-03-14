"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useAppSelector } from '@/redux/hooks';
import { spaces } from '../../../public/data/spacesList'
import { useDateRange, useSpaces } from '../hooks/useUrl';
import { borderColours } from '../dashboard/SpaceItem';
import { toFullDateFormat } from '../utils/utils';
import { useVotes } from '../hooks/useVotes';
import { useProposals } from '../hooks/useProposals';
import { ChartCanvas } from '../ui/ChartCanvas';
import { useDimensions } from '@/app/hooks/useDimensions';
import { useRef } from 'react';
import { Heatmap } from '../dashboard/charts/Heatmap';

export const InfoSpaceDialog = () => {
  const heatmapRef = useRef(null);
  const { modal } = useAppSelector(state => state.userInput)
  const { selectedSpaces } = useSpaces() 
  const { d1, d2 } = useDateRange()
  const { selectedVotes } = useVotes() 
  const { selectedProposals } = useProposals() 
  const { height: heightDiv, width: widthDiv } = useDimensions(heatmapRef)

  let selectedSpace: string; 
  modal == 'search' || 
  modal == 'about' || 
  modal == 'settings' || 
  modal == 'savedSearches' || 
  modal == 'none' ? 
  selectedSpace = '' 
  :
  selectedSpace = modal

  const startDate = Math.min(d1, d2)
  const endDate = Math.max(d1, d2)

  const selectedSpaceData = spaces.find(space => space.id == selectedSpace )
  const selectedProposalsOfDAO = selectedProposals?.filter(proposal => proposal.space.id === selectedSpace)
  const selectedVotesForDAO = selectedVotes?.filter(vote => vote.fullProposal?.space.id === selectedSpace)
  const uniqueVoters = Array.from(new Set(selectedVotesForDAO?.map(vote => vote.voter))) 

  // console.log("Heatmap @InfoSpace: ", Heatmap)

  // console.log( {
  //   heightDiv: heightDiv, 
  //   widthDiv: widthDiv
  // })

  return (

    <ModalDialog 
      modalName = 'infoSpace'
    > 
      <div>
        <div className="flex flex-row" ref = {heatmapRef}>
          <div className="flex w-fit items-center justify-start">
            <label className= {`border-4 overflow-hidden flex h-40 w-40 flex-col items-start justify-start rounded-full shadow-lg ${borderColours[selectedSpaces.indexOf(selectedSpace) % 18]}`} >
              <img
                className="h-40 w-40"
                aria-hidden="true"
                src={`https://cdn.stamp.fyi/space/${selectedSpace}?s=96`}
                alt="DAO space icon"
              />
            </label>
          </div>
          <div className='flex grow w-full items-center  grid grid-cols-1 p-4'>
            <p className='w-full text-bold text-slate-600 dark:text-slate-300 text-2xl'> 
              {selectedSpace} 
            </p> 
            <ul className="list-none list-inside w-96 text-wrap text-slate-600 dark:text-slate-300">
              <li> 
                <article className='text-wrap italic pb-4'>
                  {selectedSpaceData ? selectedSpaceData.about : "No description provided."} 
                </article> 
              </li>
              <li className=''> 
                {
                  selectedSpaceData && selectedSpaceData.categories.length > 0 ? 
                    `Categories: ${selectedSpaceData.categories.map((category: string) => category).join(", ")}`
                    : 
                    `No categories defined.`
                }
              </li>
              <li>Proposals: {selectedProposalsOfDAO ? selectedProposalsOfDAO.length : "n/a"}  </li>
              <li>Votes: {selectedVotesForDAO ? selectedVotesForDAO.length : "n/a"}  </li>
              <li>Unique Voters: {uniqueVoters ? uniqueVoters.length : "n/a" } </li>
            </ul>
          </div> 
        </div>

        <div 
          className="border border-slate-200 dark:border-slate-600 mt-4 rounded-lg h-14"
          > 
            <ChartCanvas
              VizComponent={ Heatmap } 
              vizName={"heatmap"}
              maxWidth={widthDiv == 0 ? 500 : widthDiv}
              height={50}
              />
        </div>
        
        <p className='text-gray-500 text-center mt-6'> 
          {`Data for period ${toFullDateFormat(startDate)} - ${toFullDateFormat(endDate)}.`}
        </p> 
        
      </div>
    
  </ModalDialog>
  )
}

export default InfoSpaceDialog