// import { Button } from "@lad/ui";

import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import DemoTranslation from "@/components/DemoTranslation";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to LAD Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
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

      {/* Demo Translation Component */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Internationalization Demo
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Try switching languages using the language switcher in the header
          above!
        </p>
        <DemoTranslation />
      </div>
    </div>
  );
}
