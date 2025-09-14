"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { assets } from "@/constants/assets";
import Image from "next/image";
import { Clock, Monitor, Smartphone, Wallet } from "lucide-react";
import { twMerge } from "tailwind-merge";

const AppFeatures = () => {
  const t = useTranslations("appFeatures");
  const appFeaturesList = [
    {
      icon: <Smartphone className="size-10" aria-hidden />,
      title: t("feature1"),
      description: t("feature1Description"),
    },
    {
      icon: <Clock className="size-10" aria-hidden />,
      title: t("feature2"),
      description: t("feature2Description"),
    },
    {
      icon: <Wallet className="size-10" aria-hidden />,
      title: t("feature3"),
      description: t("feature3Description"),
    },
    {
      icon: <Monitor className="size-10" aria-hidden />,
      title: t("feature4"),
      description: t("feature4Description"),
    },
  ];

  const firstCol = appFeaturesList.slice(
    0,
    Math.ceil(appFeaturesList.length / 2)
  );
  const secondCol = appFeaturesList.slice(
    Math.ceil(appFeaturesList.length / 2)
  );

  return (
    <motion.section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-20 bg-[#cce2ec] opacity-30 dark:hidden"></div>
      <div className=" absolute z-10 dark:hidden inset-0">
        <Image
          src={assets.appFeaturesBg}
          alt="app features bg"
          className="w-full h-full object-cover"
          width={2000}
          height={2000}
        />
      </div>
      <div className="relative @container py-16 md:py-24 inset-0 mx-auto max-w-5xl px-6 z-30 text-[#1B3654] dark:text-foreground">
        <div className="flex flex-col gap-16">
          <motion.div className="text-center space-y-4">
            <motion.h2 className="text-3xl font-semibold lg:text-4xl">
              {t("title")}
            </motion.h2>
            <motion.p className="dark:text-muted-foreground text-lg leading-relaxed">
              {t("description")}
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="max-w-md mx-auto h-full items-center lg:justify-center flex flex-col gap-16">
              {firstCol.map((item) => (
                <div
                  key={item.title}
                  className={twMerge("w-full flex flex-col gap-4")}
                >
                  <div>{item.icon}</div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden rounded-lg lg:block max-h-[500px] overflow-hidden">
              <Image
                src={assets.appFeaturesPhone}
                alt="app features phone"
                width={500}
                height={400}
              />
            </div>
            <div className="max-w-md mx-auto h-full items-center justify-center flex flex-col gap-16">
              {secondCol.map((item) => (
                <div
                  key={item.title}
                  className={twMerge("w-full flex flex-col gap-4")}
                >
                  <div>{item.icon}</div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AppFeatures;
