// import FetchSpaces from "./components/FetchSpaces";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useAppSelector } from "./reducers/hooks";

import AboutDialog from "../components/modals/AboutModal";
import SettingsDialog from "../components/modals/SettingsModal";
import SavedSearchesDialog from "../components/modals/SavedSearches";
// import SearchDialog from "../components/modals/SearchModal";

import SpacesList from "../components/SpacesList";
import NetworkComponent from "../components/NetworkChart";
import HeatMap from "../components/Heatmap";
import NavBar from "../components/NavBar";
// import UpdateState from "../components/UpdateState";
import { RangeSlider } from "../components/ui/RangeSlider";

const Home = () => {

  return (

      <div className="max-h-screen grid grid-cols-1 relative">
        <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> 

          <NavBar />

            <> 
            <div className="flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
              <div> 
                <SpacesList/>
              </div>
              <NetworkComponent />
              <HeatMap />
              <RangeSlider /> 
            </div> 
            </>
      </div>

  );
}

export default Home
