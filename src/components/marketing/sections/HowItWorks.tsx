"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

const HowItWorks = () => {
  const t = useTranslations("howItWorks");
  const [showVideo, setShowVideo] = useState(true);
  const steps = [
    {
      id: "01",
      title: t("step1"),
      description: t("step1Description"),
    },
    {
      id: "02",
      title: t("step2"),
      description: t("step2Description"),
    },

    {
      id: "03",
      title: t("step3"),
      description: t("step3Description"),
    },

    {
      id: "04",
      title: t("step4"),
      description: t("step4Description"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <motion.section
      className="py-16 lg:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-semibold lg:text-4xl text-balance"
            >
              {t("title")}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              {t("description")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("watchVideo")} 👇
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              {showVideo ? (
                <VideoPlayer
                  src={"/placeholder-vid.mp4"}
                  poster={"/placeholder-vid.mp4"}
                  className="w-full aspect-video"
                />
              ) : (
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <svg
                          className="w-8 h-8 text-primary-foreground ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        Click to play video
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          {/* Steps */}
          <motion.div variants={itemVariants} className="h-full bg-[linear-gradient(180deg,#547D9C_0%,#A0B4C3_159.54%)] dark:bg-[linear-gradient(180deg,#1b262e_0%,#151b1f_159.54%)] p-8  ms-8 flex flex-col items-start justify-between gap-8">
            {steps.map((step) => (
              <motion.div
                variants={itemVariants}
                key={step.id}
                className="flex flex-col gap-2 pl-4 lg:pl-8  rtl:pr-4 rtl:lg:pr-8 relative"
              >
                <div className="absolute top-0 -left-16 lg:-left-20 rtl:-right-16 rtl:lg:-right-20 w-16 lg:w-24 h-16 lg:h-full bg-design-main flex items-center justify-center">
                  <span className="text-lg lg:text-3xl font-light text-white">
                    {step.id}
                  </span>
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm lg:text-base text-[#F6E5E5]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
