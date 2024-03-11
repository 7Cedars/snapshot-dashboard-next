// £ack adapted from https://nextjsdev.com/dark-mode-in-next-js-13-app-using-tailwind-css/#step-3-creating-the-theme-provider-and-theme-switcher

"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  SunIcon,
  MoonIcon
 } from '@heroicons/react/24/outline'

const ThemeSwitch = () => {
  const { systemTheme, theme, setTheme } = useTheme()

  const currentTheme = theme === "system" ? systemTheme : theme 

  console.log("theme: ", theme )

  return (
    currentTheme == "dark" ? 
    <button
      className="text-slate-400 hover:text-blue-500 font-bold py-2 px-4"
      type="submit"
      onClick={() => setTheme("light")} 
      >
      <SunIcon
        className="h-6 w-6"
        aria-hidden="true"
      />
    </button>
    :
    <button 
      className="text-slate-800 hover:text-blue-500 font-bold py-2 px-4"
      type="submit"
      onClick={() => setTheme("dark")} 
      >
      <MoonIcon
        className="h-6 w-6"
        aria-hidden="true"
      />
    </button>

    // <select value={theme} onChange={e => setTheme(e.target.value)}>
    //   <option value="system">System</option>
    //   <option value="dark">Dark</option>
    //   <option value="light">Light</option>
    // </select>
  )
}

export default ThemeSwitch