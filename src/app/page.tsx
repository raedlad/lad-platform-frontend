// import { Button } from "@lad/ui";

import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to LAD Platform
        </h1>
        <p className="text-lg text-n-7 max-w-md">
          Your comprehensive solution for authentication and user management
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
          <Button variant="default" size="lg">
          
            Get Started
          </Button>
          </Link>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
