"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Users,
  Building2,
  HardHat,
  Wrench,
  Package,
  UserCheck,
  ArrowLeft,
  Landmark,
  Building,
} from "lucide-react";

interface CategoryItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

const WhoItsFor = () => {
  const t = useTranslations("whoItsFor");
  const [activeTab, setActiveTab] = useState("seeker");

  const serviceSeekerCategories: CategoryItem[] = [
    {
      icon: <Users className="size-8" />,
      title: t("individuals"),
      description: t("individualsDescription"),
      href: "/auth/register?type=individual",
    },
    {
      icon: <Building2 className="size-8" />,
      title: t("organizations"),
      description: t("organizationsDescription"),
      href: "/auth/register?type=organization",
    },
    {
      icon: <Landmark className="size-8" />,
      title: t("government"),
      description: t("governmentDescription"),
      href: "#",
      comingSoon: true,
    },
  ];

  const serviceProviderCategories: CategoryItem[] = [
    {
      icon: <HardHat className="size-8" />,
      title: t("contractors"),
      description: t("contractorsDescription"),
      href: "/auth/register?type=contractor",
    },
    {
      icon: <Wrench className="size-8" />,
      title: t("freelanceEngineers"),
      description: t("freelanceEngineersDescription"),
      href: "/auth/register?type=freelance-engineer",
    },
    {
      icon: <Building className="size-8" />,
      title: t("engineeringOffices"),
      description: t("engineeringOfficesDescription"),
      href: "/auth/register?type=engineering-office",
    },
    {
      icon: <Package className="size-8" />,
      title: t("suppliers"),
      description: t("suppliersDescription"),
      href: "/auth/register?type=supplier",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="py-16 md:py-24 "
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="@container mx-auto max-w-6xl px-6">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold lg:text-5xl text-balance mb-6">
            {t("title")}
          </h2>
          <p className="text-design-gray dark:text-n-3 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
            dir="rtl"
          >
            <TabsList className="grid h-13 rounded-full w-full grid-cols-2 mb-10 max-w-lg mx-auto backdrop-blur-sm border shadow-md">
              <TabsTrigger
                value="seeker"
                className=" rounded-full flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-design-main data-[state=active]:to-p-6 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <UserCheck className="size-4" />
                {t("serviceSeeker")}
              </TabsTrigger>
              <TabsTrigger
                value="provider"
                className="rounded-full flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-design-main data-[state=active]:to-p-6 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Wrench className="size-4" />
                {t("serviceProvider")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seeker" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {serviceSeekerCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    variants={cardVariants}
                    whileHover={{}}
                  >
                    <div className="group relative h-full">
                      {/* Modern Card with Glass Effect */}
                      <div className="relative h-full bg-gradient-to-br from-design-main/10 via-design-main/5 to-white/10 dark:from-n-8/15 dark:via-n-8/10 dark:to-n-8/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-n-6/30 shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5 transition-opacity duration-700">
                          <div className="absolute inset-0 bg-gradient-to-br from-design-main/20 via-transparent to-p-5/20"></div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-design-main/10 to-transparent rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-p-4/10 to-transparent rounded-full blur-2xl"></div>
                        </div>

                        {/* Floating Icon Container */}
                        <div className="relative pt-8">
                          <div className="relative mx-auto w-20 h-20 mb-6">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-design-main/20 via-p-5/20 to-design-main/20 animate-pulse"></div>
                            {/* Icon Container */}
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-design-main/10 via-p-3/20 to-p-4/20 transition-all duration-500 flex items-center justify-center shadow-lg">
                              <div className="text-design-main dark:text-p-4 transition-colors duration-300 text-2xl">
                                {category.icon}
                              </div>
                            </div>
                            {/* Floating Particles */}
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-design-main/30 rounded-full animate-bounce delay-100"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-p-4/40 rounded-full animate-bounce delay-300"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative px-8 flex-1 flex flex-col py-6">
                          <h3 className="text-2xl font-bold mb-4 text-design-secondary dark:text-n-1 transition-colors duration-300 text-center">
                            {category.title}
                          </h3>
                          <p className="text-design-gray dark:text-n-4 text-base leading-relaxed transition-colors duration-300 text-center mb-8 flex-1">
                            {category.description}
                          </p>
                          <div className="relative mt-auto">
                            {category.comingSoon ? (
                              <Button
                                disabled
                                className="relative w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-xl font-bold py-4 rounded-2xl border-0 cursor-not-allowed opacity-75"
                              >
                                <span className="flex items-center gap-2">
                                  {t("comingSoon")}
                                </span>
                              </Button>
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-design-main to-p-6 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <Button
                                  asChild
                                  className="relative w-full bg-gradient-to-r from-design-main to-p-6 hover:from-p-6 hover:to-p-7 text-white shadow-xl hover:shadow-2xl group-hover:scale-105 transition-all duration-300 font-bold py-4 rounded-2xl border-0"
                                >
                                  <Link
                                    href={category.href}
                                    className="flex items-center justify-center gap-3 text-lg"
                                  >
                                    <span className="flex items-center gap-2">
                                      {t("registerNow")}
                                      <ArrowLeft className="size-5 ltr:rotate-180 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300" />
                                    </span>
                                  </Link>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-design-main/20 rounded-full transition-colors duration-300"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-p-4/30 rounded-full transition-colors duration-300"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="provider" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {serviceProviderCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    variants={cardVariants}
                    whileHover={{}}
                  >
                    <div className="group relative h-full">
                      {/* Modern Card with Glass Effect */}
                      <div className="relative h-full bg-gradient-to-br from-design-main/10 via-design-main/5 to-white/10 dark:from-n-8/15 dark:via-n-8/10 dark:to-n-8/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-n-6/30 shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5 transition-opacity duration-700">
                          <div className="absolute inset-0 bg-gradient-to-br from-design-main/20 via-transparent to-p-5/20"></div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-design-main/10 to-transparent rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-p-4/10 to-transparent rounded-full blur-2xl"></div>
                        </div>

                        {/* Floating Icon Container */}
                        <div className="relative pt-8">
                          <div className="relative mx-auto w-20 h-20 mb-6">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-design-main/15 via-p-5/10 to-design-main/15 animate-pulse"></div>
                            {/* Icon Container */}
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-design-main/10 via-p-3/20 to-p-4/20 transition-all duration-500 flex items-center justify-center shadow-lg">
                              <div className="text-design-main dark:text-p-4 transition-colors duration-300 text-2xl">
                                {category.icon}
                              </div>
                            </div>
                            {/* Floating Particles */}
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-design-main/30 rounded-full animate-bounce delay-100"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-p-4/40 rounded-full animate-bounce delay-300"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative px-8 flex-1 flex flex-col py-6">
                          <h3 className="text-2xl font-bold mb-4 text-design-secondary dark:text-n-1 transition-colors duration-300 text-center">
                            {category.title}
                          </h3>
                          <p className="text-design-gray dark:text-n-4 text-base leading-relaxed transition-colors duration-300 text-center mb-8 flex-1">
                            {category.description}
                          </p>

                          {/* Modern Button */}
                          <div className="relative mt-auto">
                            {category.comingSoon ? (
                              <Button
                                disabled
                                className="relative w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-xl font-bold py-4 rounded-2xl border-0 cursor-not-allowed opacity-75"
                              >
                                <span className="flex items-center gap-2">
                                  {t("comingSoon")}
                                </span>
                              </Button>
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-design-main to-p-6 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <Button
                                  asChild
                                  className="relative w-full bg-gradient-to-r from-design-main to-p-6 hover:from-p-6 hover:to-p-7 text-white shadow-xl hover:shadow-2xl group-hover:scale-105 transition-all duration-300 font-bold py-4 rounded-2xl border-0"
                                >
                                  <Link
                                    href={category.href}
                                    className="flex items-center justify-center gap-3 text-lg"
                                  >
                                    <span className="flex items-center gap-2">
                                      {t("registerNow")}
                                      <ArrowLeft className="size-5 ltr:rotate-180 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300" />
                                    </span>
                                  </Link>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-design-main/20 rounded-full transition-colors duration-300"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-p-4/30 rounded-full transition-colors duration-300"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhoItsFor;
