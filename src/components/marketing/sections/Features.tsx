"use client";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { ListChecks, ShieldCheck, Handshake } from "lucide-react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export default function Features() {
  const t = useTranslations("features");

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <motion.section
      className="py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="@container mx-auto max-w-5xl px-6">
        <motion.div
          className="text-center"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-balance text-3xl font-semibold lg:text-4xl"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="mt-4 text-muted-foreground"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <motion.div
          className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 
                    [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] 
                    *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]"
          variants={containerVariants}
        >
          {/* Legal Services */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardHeader>
                <div>
                  <CardDecorator
                    className="relative mx-auto size-36 duration-400 
                [--color-border:color-mix(in_oklab,var(--color-i-9)50%,transparent)] 
                group-hover:[--color-border:var(--color-i-5),] 
                group-hover:bg-i-5/20
                dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] 
                dark:group-hover:bg-white/5 
                group-hover:text-i-5
                dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]"
                  >
                    <div>
                      <ShieldCheck className="size-12" aria-hidden />
                    </div>
                  </CardDecorator>
                </div>
                <h3 className="mt-4 font-medium">{t("feature1")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("feature1Description")}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Architecture & Engineering */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardHeader>
                <div>
                  <CardDecorator
                    className="relative mx-auto size-36 duration-400 
                [--color-border:color-mix(in_oklab,var(--color-s-9)50%,transparent)] 
                group-hover:[--color-border:var(--color-s-5),] 
                group-hover:bg-s-5/20
                dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] 
                dark:group-hover:bg-white/5 
                group-hover:text-s-5
                dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]"
                  >
                    <div>
                      <ListChecks className="size-12" aria-hidden />
                    </div>
                  </CardDecorator>
                </div>
                <h3 className="mt-4 font-medium">{t("feature2")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("feature2Description")}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Marketplace & Workflow */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <CardHeader>
                <div>
                  <CardDecorator
                    className="relative mx-auto size-36 duration-400 
                [--color-border:color-mix(in_oklab,var(--color-p-9)50%,transparent)] 
                group-hover:[--color-border:var(--color-p-5)]
                group-hover:bg-p-5/20
                dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] 
                dark:group-hover:bg-white/5 
                dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)] group-hover:text-p-5"
                  >
                    <div>
                      <Handshake className="size-12" aria-hidden />
                    </div>
                  </CardDecorator>
                </div>
                <h3 className="mt-4 font-medium">{t("feature3")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("feature3Description")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

const CardDecorator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={twMerge(
      "relative mx-auto size-36 duration-400 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:var(--color-design-main),] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]",
      className
    )}
  >
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-95%"
    />
    <div className="dark:bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t bg-white">
      {children}
    </div>
  </div>
);
