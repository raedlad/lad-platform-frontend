"use client";
import CreateProject from "@/features/project/components/client/CreateProject";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const projectId = useParams().id as string;

  return (
    <div className="section">
      <CreateProject projectId={projectId} />
    </div>
  );
};

export default Page;
