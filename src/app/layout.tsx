import './globals.css'
import type { Metadata } from 'next'
import { ApolloWrapper } from "./ApolloWrapper";
import { ReduxProvider } from "../redux/provider" 

import AboutDialog from "./modals/About";
import SettingsDialog from "./modals/Settings";
import SavedSearchesDialog from "./modals/SavedSearches";
import SearchDialog from './modals/Search';
import NavBar from './NavBar';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import ReactQueryProviders from './ReactQueryWrapper';

const queryClient = new QueryClient()

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
            
                <AboutDialog /> <SettingsDialog /> <SavedSearchesDialog /> < SearchDialog /> 
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
