import { Button } from "@shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-4 w-full max-w-md mx-auto flex flex-col items-center justify-center gap-4 text-center border border-gray-200 rounded-md p-4 shadow-md">
        <h1 className="text-4xl font-bold text-red-400">404</h1>
        <p className="text-lg">Page Not Found</p>
        <Button className="">
          <Link href="/" className="flex items-center gap-2">
            Go Back <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default notFound;
