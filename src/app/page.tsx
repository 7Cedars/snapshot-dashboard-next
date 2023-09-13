"use client"

// import FetchSpaces from "./components/FetchSpaces";
import { useAppSelector } from  "../redux/hooks";
import { useEffect } from "react";

import AboutDialog from "./modals/AboutModal";
import SettingsDialog from "./modals/SettingsModal";
import SavedSearchesDialog from "./modals/SavedSearches";
// import SearchDialog from "../components/modals/SearchModal";

import SpacesList from "./dashboard/SpacesList";
import NetworkComponent from "./dashboard/NetworkChart";
import HeatMap from "./dashboard/Heatmap";
import NavBar from "./NavBar";
// import UpdateState from "../components/UpdateState";
import { RangeSlider } from "./ui/RangeSlider";
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Home = () => {

  return (
      <div className="max-h-screen grid grid-cols-1 relative">
        
        <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> 
        <NavBar/>

            <> 
            <div className="flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
              <div> 
                A Dashboard for Visualising Relational Voting Behaviour on Snapshot 
                {/* <SpacesList/> */}
              </div>
              {/* <NetworkComponent />
              <HeatMap />
              <RangeSlider />  */}
            </div> 
            </>
      </div>

  );
}

export default Home