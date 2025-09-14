"use client";
import { assets } from "@/constants/assets";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Star, ThumbsUp, Download } from "lucide-react";

const DownloadApp = () => {
  const t = useTranslations("downloadApp");

  const appData = [
    {
      icon: <Star className="size-8" aria-hidden />,
      number: "1500",
      description: t("review"),
    },
    {
      icon: <ThumbsUp className="size-8" aria-hidden />,
      number: "29800",
      description: t("like"),
    },
    {
      icon: <Download className="size-8" aria-hidden />,
      number: "59000",
      description: t("download"),
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  return (
    <motion.section
      className="py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-8">
            <motion.h2 className="text-3xl font-semibold lg:text-4xl">
              {t("title")}
            </motion.h2>
            <motion.div className="flex gap-4">
              <Link
                href={"/"}
                className="group relative overflow-hidden bg-n-9 dark:border dark:border-n-7 rounded-lg hover:bg-n-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center px-4 py-3 min-w-[180px]">
                  <div className="flex-shrink-0">
                    <Image
                      src={assets.googlePlay}
                      alt="google play"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="ms-3 text-start">
                    <div className="text-xs text-gray-300 leading-tight">
                      {t("googlePlayGetIt")}
                    </div>
                    <div className="text-lg font-medium text-white leading-tight">
                      {t("googlePlay")}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Apple App Store Button */}
              <Link
                href={"/"}
                className="group relative overflow-hidden bg-n-9 dark:border dark:border-n-7 rounded-lg hover:bg-n-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center px-4 py-3 min-w-[180px]">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div className="ms-3 text-start">
                    <div className="text-xs text-gray-300 leading-tight">
                      {t("appleStoreGetIt")}
                    </div>
                    <div className="text-lg font-medium text-white leading-tight">
                      {t("appleStore")}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            <motion.div
              className="w-full flex items-center gap-4 text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {appData.map((item, index) => (
                <motion.div
                  key={item.description}
                  className="group relative w-32 h-32 rounded-lg flex flex-col items-center justify-center p-4 gap-2 bg-[linear-gradient(90deg,#1B3654_0%,#0B4E98_100%)] overflow-hidden cursor-pointer"
                >
                  {/* Light effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm" />

                  {/* Content */}
                  <motion.div
                    className="relative z-10 flex flex-col items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {item.icon}
                    </motion.div>

                    <motion.p
                      className="text-xl font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {item.number}
                    </motion.p>

                    <motion.p
                      className="text-white font-semibold text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-2 -left-2 w-36 h-36 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 transform -rotate-45" />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="flex items-center">
            <Image
              src={assets.downloadApp}
              alt="download app"
              className="w-full h-full"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DownloadApp;
