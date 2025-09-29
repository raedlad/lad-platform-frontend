"use client";
import React from "react";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { useTranslations } from "next-intl";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import Link from "next/link";
import { assets } from "@/constants/assets";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
      y: 8,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.2,
        duration: 0.6,
      },
    },
  },
};

export default function HeroSection() {
  const t = useTranslations("hero");
  const tDashboard = useTranslations("dashboard.individual");
  return (
    <>
      <main className="relative overflow-hidden pt-16 lg:pt-24">
        <div className="w-full h-full absolute inset-0 max-h-[calc(100%-30%)] top-0 bg-gradient-to-b from-[#4B7697] to-[#E8E8E8] dark:from-[#0f2433] dark:to-[#0f0f0f]"></div>
        <section className=" flex flex-col justify-between">
          <div className="relative z-10 mx-auto py-16 text-center text-white">
            <div className="max-w-5xl flex flex-col items-center justify-center gap-2">
              <div className="px-4">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.7}
                  as="h1"
                  className="text-balance text-3xl font-bold md:text-5xl"
                >
                  {t("title")}
                </TextEffect>
              </div>
              <div className="max-w-4xl mx-auto px-4">
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.6}
                  delay={0.2}
                  as="p"
                  className="text-white mt-4 whitespace-pre-line md:text-xl "
                >
                  {t("description")}
                </TextEffect>
              </div>
              <div className="mt-4 lg:mt-6">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.02,
                          delayChildren: 0.3,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <Link href="/signup" className="block">
                    <MovingBorderButton className="text-lg">
                      <span className="flex items-center gap-2">
                        {t("createAccount")}
                        <ArrowRightIcon className="w-4 h-4 rtl:rotate-180" />
                      </span>
                    </MovingBorderButton>
                  </Link>
                </AnimatedGroup>
              </div>
            </div>
          </div>
          <div className=" w-full h-full">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.4,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div
                key={1}
                className="relative w-full lg:max-w-5xl h-[400px] sm:h-[500px] md:h-[600px] p-8 mx-auto"
              >
                <div className="w-full h-full p-2 border border-[#e7e7e7] dark:border-[#454444] rounded-md bg-gradient-to-b from-transparent to-[#f4f4f4] dark:from-transparent dark:to-[#1a1a1a]">
                  <div className="w-full h-full p-2 border border-[#e7e7e7] dark:border-[#454444] rounded-md bg-gradient-to-b from-transparent to-[#f4f4f4] dark:from-transparent dark:to-[#1a1a1a]">
                    <Image
                      src={assets.heroImage}
                      className="w-full h-full object-fill"
                      alt="hero image"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
                <div
                  key={1}
                  className="absolute top-1/9 -left-20 hidden lg:block"
                >
                  <div className="w-full bg-card  px-12 flex flex-col items-center justify-center py-2  max-w-md font-semibold shadow-md border border-[#AFAFAF] dark:border-[#454444] rounded-md">
                    <Image
                      src={assets.activeProjects}
                      alt="active projects"
                      width={100}
                      height={100}
                      className="w-10 h-10"
                    />
                    <h1 className="text-lg font-bold text-design-main">12</h1>
                    <h2 className="font-medium">
                      {tDashboard("statistics.activeProjects")}
                    </h2>
                    <p className="text-design-main">
                      {tDashboard("statistics.activeProjectsCount", {
                        count: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div
                  key={2}
                  className="absolute top-2/3 -right-20 hidden lg:block"
                >
                  <div className="w-full bg-card px-12 flex flex-col items-center justify-center py-2  max-w-md font-semibold shadow-md border border-[#AFAFAF] dark:border-[#454444] rounded-md">
                    <Image
                      src={assets.activeProjects}
                      alt="active projects"
                      width={100}
                      height={100}
                      className="w-10 h-10"
                    />
                    <h1 className="text-lg font-bold text-design-main">12</h1>
                    <h2 className="font-medium">
                      {tDashboard("statistics.activeProjects")}
                    </h2>
                    <p className="text-design-main">
                      {tDashboard("statistics.activeProjectsCount", {
                        count: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
