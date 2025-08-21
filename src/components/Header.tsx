"use client"

import { ThemeToggle } from "@shared/components/ThemeToggle"


const Header = () => {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header

