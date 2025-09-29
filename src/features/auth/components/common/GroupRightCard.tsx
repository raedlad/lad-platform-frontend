"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { assets } from "@/constants/assets";
import { motion } from "framer-motion";

const GroupRightCard = () => {
  const t = useTranslations("auth");

  return (
    <div className="h-full w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex-1">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-design-main/20 via-p-6/10 to-design-main/20"></div>

      {/* Full Height & Width Background Image */}
      <Image
        src={assets.smartMatching}
        alt="Smart Group Selection"
        fill
        className="object-cover"
        priority
        onError={(e) => {
          console.log("Image failed to load:", e);
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Bottom Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Title */}
          <motion.h1
            className="text-4xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t("roleSelection.title")}
          </motion.h1>

          {/* Accent Line */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="w-20 h-1 bg-gradient-to-r from-design-main via-p-6 to-design-main rounded-full"></div>
            <div className="absolute inset-0 w-20 h-1 bg-gradient-to-r from-design-main via-p-6 to-design-main rounded-full blur-sm opacity-50"></div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg text-white/90 leading-relaxed font-light max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {t("roleSelection.description")}
          </motion.p>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-br-3xl"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-design-main/20 to-transparent rounded-tl-3xl"></div>
    </div>
  );
};

export default GroupRightCard;
