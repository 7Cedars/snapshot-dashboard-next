"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  SunIcon,
  MoonIcon
 } from '@heroicons/react/24/outline'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  console.log("theme: ", theme )

  return (
    theme == "dark" ? 
    <button
      className="text-slate-200 hover:text-slate-500 font-bold py-2 px-4"
      type="submit"
      onClick={() => setTheme("light")} 
      >
      <SunIcon
        className="h-7 w-7"
        aria-hidden="true"
      />
    </button>
    :
    <button 
      className="text-slate-800 hover:text-slate-900 font-bold py-2 px-4"
      type="submit"
      onClick={() => setTheme("dark")} 
      >
      <MoonIcon
        className="h-7 w-7"
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