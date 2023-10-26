import './globals.css'
import type { Metadata } from 'next'
import { ApolloWrapper } from "./ApolloWrapper";
import { ReduxProvider } from "../redux/provider" 

import AboutDialog from "./modals/About";
import SettingsDialog from "./modals/Settings";
import SavedSearchesDialog from "./modals/SavedSearches";
import SearchDialog from './modals/Search';
import InfoSpaceDialog from './modals/InfoSpace';
import NavBar from './NavBar';
import ReactQueryProviders from './ReactQueryWrapper';

export const metadata: Metadata = {
  title: 'Snapshot Dashboard',
  description: 'Uses GraphQl, Nextjs, TailwindCSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ReactQueryProviders>
        <ReduxProvider>
          <ApolloWrapper>
            
              <div className="max-h-screen w-full grid grid-cols-1 relative">
            
                <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> < SearchDialog /> <InfoSpaceDialog/>
                <NavBar/>

                {children}
              
              </div>
            
            </ApolloWrapper>
          </ReduxProvider>
        </ReactQueryProviders>
      </body>
      
    </html>
  )
}
