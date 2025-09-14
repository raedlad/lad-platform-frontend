"use client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { FacebookIcon, TwitterIcon } from "@/components/ui/social-icon";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-white border-t py-16 dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" />
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-md">
              {t("description")}
            </p>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                {t("social.follow")}
              </h4>
              <div className="flex space-x-5">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-design-main transition-colors duration-200"
                  aria-label={t("social.instagram")}
                >
                  <Instagram className="w-7 h-7" />
                </Link>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-design-main transition-colors duration-200"
                  aria-label={t("social.facebook")}
                >
                  <FacebookIcon className="w-7 h-7" />
                </Link>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-design-main transition-colors duration-200"
                  aria-label={t("social.twitter")}
                >
                  <TwitterIcon className="w-7 h-7" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              {t("quickLinks.title")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("quickLinks.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("quickLinks.projects")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("quickLinks.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("quickLinks.help")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-5">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              {t("company.title")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("company.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("company.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("company.careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("company.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-design-main text-base transition-colors duration-200"
                >
                  {t("company.news")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-gray-500 dark:text-gray-400 text-base">
              {t("copyright", { year: new Date().getFullYear() })}
            </span>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
