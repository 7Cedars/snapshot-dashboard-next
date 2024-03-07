"use client";

import { ModalDialog } from '../ui/ModalDialog';
import { useAppSelector } from '@/redux/hooks';
import { spaces } from '../../../public/data/spacesList'
import { useSpaces } from '../hooks/useUrl';
import { borderColours } from '../dashboard/SpaceItem';

          {/* Heatmap */}
          {/* <div className="border border-gray-300 mt-4 rounded-lg"> 
            <ChartCanvas
              VizComponent={ Heatmap }
              vizName={"heatmap"}
              maxWidth={3000}
              height={heatmapHeight}
              />
          </div> */}

export const InfoSpaceDialog = () => {
  const { modal: selectedSpace } = useAppSelector(state => state.userInput)
  const { selectedSpaces, removeSpace } = useSpaces() 

  return (

    <ModalDialog 
      modalName = 'infoSpace'
      // title = {`${selectedSpace}`}
      // subtitle = 'Detailed information in selected DAO and its space at Snapshot.'
    > 
  
      <>
        <div className="grid grid-cols-2">
          <div className="flex items-start justify-start pl-2 ">
            <label className= {`border-4 overflow-hidden flex h-40 w-40 flex-col items-start justify-start rounded-full shadow-lg ${borderColours[selectedSpaces.indexOf(selectedSpace) % 18]}`} >
              <img
                className="h-40 w-40"
                aria-hidden="true"
                src={`https://cdn.stamp.fyi/space/${selectedSpace}?s=96`}
                alt="DAO space icon"
              />
            </label>
          </div>

          <div> 
          List with info on DAO: 
          </div> 
        </div>
        <div> 
          HERE COME HEATMAP with ACTIVITY OVERVIEW + date range. 
        </div> 
        
      </>
    
  </ModalDialog>
  )
}

export default InfoSpaceDialog