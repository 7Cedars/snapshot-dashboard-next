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
      
      <div className="h-screen w-full flex flex-row">
        {children}
      </div>
  
  )
}
