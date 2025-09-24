import React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  HardHat,
  MapPin,
  ArrowLeft,
  Star,
} from "lucide-react";
import { Button } from "@shared/components/ui/button";
interface Project {
  logo: string;
  name: string;
  badge: string;
  location: string;
  sales: string;
  type: string;
  company: string;
  specialization: string;
  specializationType: string;
  desc: string;
  description: string;
  conbutton: string;
  viewMore: string;
}
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="w-full border border-[#AFAFAF] dark:border-[#454444] rounded-md p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex ite">
          <div className="w-full flex items-start gap-2">
            <Image
              className="w-10 h-10 rounded-full"
              src={project.logo}
              alt={project.name}
              width={16}
              height={16}
            />
            <div className="w-full flex flex-col gap-1">
              <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-1 sm:gap-4">
                <h1 className="text-base font-semibold">{project.name}</h1>
                <div className="flex  items-center  gap-2 p-2 py-1 bg-design-main text-white text-center text-xs rounded-full">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="w-fit">{project.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-[#767373] dark:text-[#AFAFAF]">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">{project.location}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[#767373] dark:text-[#AFAFAF]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="w-4 h-4 text-design-main"
                    fill="#ac8852"
                  />
                ))}
                <span className="text-xs">{project.sales}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-design-main">
              <HardHat className="w-4 h-4" />
              <span className="text-sm">{project.type} :</span>
            </div>
            <span>{project.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-design-main">
              <BriefcaseBusiness className="w-4 h-4" />
              <span className="text-sm">{project.specialization} :</span>
            </div>
            <span>{project.specializationType}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="">{project.desc} :</p>
          <p className="">{project.description}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button variant="default" size="sm" className="text-sm font-medium">
            <span>{project.conbutton}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="group text-sm font-medium text-design-main border-design-main rounded-sm group-hover:border-none group-hover:bg-transparent group-hover:text-design-main hover:bg-transparent hover:text-design-main transition-all duration-300"
          >
            <span>{project.viewMore}</span>
            <ArrowLeft className="w-4 h-4 ltr:rotate-180 hidden group-hover:block group-hover:transition-transform group-hover:duration-1000" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
