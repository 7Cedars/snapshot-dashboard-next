import './globals.css'
import type { Metadata } from 'next'
import { ApolloWrapper } from "./ApolloWrapper";
import { ReduxProvider } from "../redux/provider" 

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
        <ApolloWrapper>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ApolloWrapper>
      </body>
      
    </html>
  )
}
