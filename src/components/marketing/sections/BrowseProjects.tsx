"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";
import Link from "next/link";
import { assets } from "@/constants/assets";
import ProjectCard from "../ProjectCard";
import { Button } from "@/shared/components/ui/button";
const BrowseProjects = () => {
  const t = useTranslations("browseProjects");
  const project = {
    logo: assets.user.src,
    name: t("name"),
    location: t("location"),
    badge: t("badge"),
    sales: t("sales"),
    type: t("type"),
    company: t("company"),
    specialization: t("specialization"),
    specializationType: t("specializationType"),
    desc: t("desc"),
    description: t("description"),
    conbutton: t("conbutton"),
    viewMore: t("viewMore"),
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.section
      className="py-16 md:py-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="@container mx-auto max-w-6xl px-6 space-y-8">
        <div className="flex justify-between gap-8 lg:gap-24 items-center">
          <motion.h2
            className="text-3xl font-semibold lg:text-4xl text-balance"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {t("title")}
          </motion.h2>
          <Link
            href="/"
            className="text-design-main hover:underline hover:scale-105 transition-all duration-300"
          >
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {t("viewAll")}
            </motion.span>
          </Link>
        </div>
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              variants={cardVariants}
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ProjectCard key={index} project={project} />
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="text-design-main hover:underline hover:scale-105 transition-all duration-300"
          >
            <Button size="lg">{t("viewAllOffers")}</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default BrowseProjects;
