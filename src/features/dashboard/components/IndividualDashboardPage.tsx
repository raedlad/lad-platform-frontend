"use client";
import { assets } from "@/constants/assets";
import RecentProjects from "./cards/RecentProjects";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const IndividualDashboardPage = () => {
    const t = useTranslations();
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{t("dashboard.individual.welcome", { name: "Ahmed" })}</h1>
          <p className="text-gray-500">{t("dashboard.individual.description")}</p>
        </div>
        <div className="flex items-center justify-center text-center">
          <div className="flex items-center justify-center gap-8 max-w-4xl flex-wrap lg:flex-nowrap">
            <div className="flex flex-col items-center justify-center gap-8 p-8 max-w-md font-semibold shadow-md  border border-[#AFAFAF] rounded-md">
              <p className="text-lg font-semibold">
                {t("dashboard.individual.quickActions.createProject.description")}
              </p>
              <Link href="/dashboard/individual/projects/new">
              <button className="cursor-pointer text-sm py-3 px-8 bg-design-main text-white  rounded-full">
                {" "}
                {t("dashboard.individual.quickActions.createProject.button")}
              </button>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-8 p-8 max-w-md font-semibold shadow-md  border border-[#AFAFAF] rounded-md">
              <p className="text-lg font-semibold">
                {t("dashboard.individual.quickActions.requestMaterials.description")}
              </p>
              <button className="text-sm py-3 px-8 bg-design-main text-white  rounded-full">
                {t("dashboard.individual.quickActions.requestMaterials.button")}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-center">
          <div className="w-full flex items-center justify-center gap-8 max-w-4xl flex-wrap lg:flex-nowrap">
            <div className="w-full flex flex-col items-center justify-center py-4  max-w-md font-semibold shadow-md border border-[#AFAFAF] rounded-md">
              <Image
                src={assets.activeProjects}
                alt="active projects"
                width={100}
                height={100}
                className="w-14 h-14"
              />
              <h1 className="text-2xl font-bold text-design-main">12</h1>
              <h2 className="text-lg font-semibold">
                {t("dashboard.individual.statistics.activeProjects")}
              </h2>
              <p className="text-design-main">{t("dashboard.individual.statistics.activeProjectsCount", { count: 2 })}</p>
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4  max-w-md font-semibold shadow-md border border-[#AFAFAF] rounded-md">
              <Image
                src={assets.receivedOffers}
                alt="received offers"
                width={100}
                height={100}
                className="w-14 h-14"
              />
              <h1 className="text-2xl font-bold text-design-main">30</h1>
              <h2 className="text-lg font-semibold">
                {t("dashboard.individual.statistics.receivedOffers")}
              </h2>
              <p className="text-design-main">{t("dashboard.individual.statistics.receivedOffersCount", { count: 5 })}</p>
            </div>
            <div className="w-full flex flex-col items-center justify-center  py-4  max-w-md font-semibold shadow-md border border-[#AFAFAF] rounded-md">
              <Image
                src={assets.signedContracts}
                alt="signed contracts"
                width={100}
                height={100}
                className="w-14 h-14"
              />
              <h1 className="text-2xl font-bold text-design-main">5</h1>
              <h2 className="text-lg font-semibold">
                {t("dashboard.individual.statistics.signedContracts")}
              </h2>
              <p className="text-design-main">{t("dashboard.individual.statistics.signedContractsCount", { count: 3 })}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <RecentProjects />
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboardPage;
