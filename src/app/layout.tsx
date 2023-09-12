import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ApolloWrapper } from "./ApolloWrapper";
import store from '../redux/reducers/store'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

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
      <Provider store={store}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </Provider>
    </html>
  )
}
