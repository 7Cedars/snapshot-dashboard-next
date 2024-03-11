// £ack adapted from https://nextjsdev.com/dark-mode-in-next-js-13-app-using-tailwind-css/#step-3-creating-the-theme-provider-and-theme-switcher

"use client"

import {ThemeProvider} from 'next-themes';
import { useState, useEffect } from 'react'

type Props = {
    children: string | React.JSX.Element | React.JSX.Element[];
  }

export const ThemeWrapper = ({children} : Props) => {
  const [mounted,setMounted] = useState<boolean>(false);

  useEffect (() => {
      setMounted(true);
  },[]);

  if(!mounted){
      return <>{children}</>;
  }

  return (
    <ThemeProvider enableSystem={true} attribute='class'>
      {children}
    </ThemeProvider>
  )
}
