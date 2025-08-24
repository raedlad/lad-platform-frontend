"use client";

import { ThemeToggle } from "@shared/components/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  return (
    <header className="w-full  bg-transparent ">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-xl font-bold"></h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
