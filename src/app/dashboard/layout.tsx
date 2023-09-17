import '../globals.css'
// import type { Metadata } from 'next'
// import { ApolloWrapper } from "../ApolloWrapper";
// import { ReduxProvider } from "../../redux/provider" 

import AboutDialog from "../modals/About";
import SettingsDialog from "../modals/Settings";
import SavedSearchesDialog from "../modals/SavedSearches";
import SearchDialog from '../modals/Search';
import NavBar from '../NavBar';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* <ReduxProvider>
        <ApolloWrapper> */}
          
            <div className="max-h-screen grid grid-cols-1 relative">
          
              <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> < SearchDialog /> 
              <NavBar/>

              {children}
            
            </div>
          
          {/* </ApolloWrapper>
        </ReduxProvider> */}
      </div>
  )
}
