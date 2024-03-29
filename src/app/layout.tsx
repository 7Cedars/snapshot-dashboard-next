import './globals.css'
import type { Metadata } from 'next'
import { ApolloWrapper } from "./ApolloWrapper";
import { ReduxProvider } from "../redux/provider" 

import AboutDialog from "./modals/About";
import SavedSearchesDialog from "./modals/SavedSearches";
import SearchDialog from './modals/Search';
import NavBar from './NavBar';
import ReactQueryProviders from './ReactQueryWrapper';
import { ThemeWrapper } from './ThemeWrapper';

export const metadata: Metadata = {
  title: 'DAO Network Dashboard',
  description: 'Build with GraphQl, Nextjs, TailwindCSS and Snapshot`s API',
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
            <ThemeWrapper>
            
              <div className="relative h-screen w-full grid grid-cols-1 bg-slate-50 dark:bg-slate-900">
                <AboutDialog /> <SavedSearchesDialog /> < SearchDialog /> 
                <div > 
                  <NavBar/>
                </div> 
                <div> 
                 {children}
                </div> 
              </div>
              
              </ThemeWrapper>
            </ApolloWrapper>
          </ReduxProvider>
        </ReactQueryProviders>
      </body>
      
    </html>
  )
}
