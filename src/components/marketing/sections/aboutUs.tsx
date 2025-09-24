"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import React from "react";
import { assets } from "@/constants/assets";
import Image from "next/image";

const AboutUs = () => {
  const t = useTranslations("aboutUs");
  return (
    <motion.section className="py-16 md:py-24 bg-[#B4C9DC] dark:bg-black">
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4"> 
        <motion.div className="text-center">
          <motion.h2 className="text-3xl font-semibold lg:text-4xl">
            {t("title")}
          </motion.h2>
        </motion.div>
        <motion.div className="text-center max-w-xl mx-auto">
          <motion.p className="text-muted-foreground font-semibold">
            {t("description")}
          </motion.p>
        </motion.div>
        <motion.div className="w-full h-full p-2 mx-auto mt-8">
          <Image
            src={assets.aboutUs}
            alt="about us"
            width={1000}
            height={1000}
            className="w-full h-full mx-auto"
          />
        </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
