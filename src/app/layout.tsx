import './globals.css'
import type { Metadata } from 'next'
import { ApolloWrapper } from "./ApolloWrapper";
import { ReduxProvider } from "../redux/provider" 

import AboutDialog from "./modals/AboutModal";
import SettingsDialog from "./modals/SettingsModal";
import SavedSearchesDialog from "./modals/SavedSearches";
import NavBar from './NavBar';

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
      <ReduxProvider>
        <ApolloWrapper>
          
            <div className="max-h-screen grid grid-cols-1 relative">
          
              <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> 
              <NavBar/>

              {children}
            
            </div>
          
          </ApolloWrapper>
        </ReduxProvider>
      </body>
      
    </html>
  )
}
