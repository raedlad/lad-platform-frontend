"use client";

import { Direction } from "radix-ui";
import { createContext, useContext, useEffect, useState } from "react";

interface DirectionContextType {
  direction: "ltr" | "rtl";
}

const DirectionContext = createContext<DirectionContextType>({
  direction: "ltr",
});

export const useDirection = () => useContext(DirectionContext);

interface DirectionProviderProps {
  children: React.ReactNode;
}

export default function DirectionProvider({
  children,
}: DirectionProviderProps) {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    // Get direction from HTML element
    const htmlDir = document.documentElement.dir as "ltr" | "rtl";
    setDirection(htmlDir || "ltr");

    // Listen for direction changes (when locale changes)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "dir"
        ) {
          const newDir = document.documentElement.dir as "ltr" | "rtl";
          setDirection(newDir || "ltr");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <DirectionContext.Provider value={{ direction }}>
      <Direction.Provider dir={direction}>{children}</Direction.Provider>
    </DirectionContext.Provider>
  );
}
