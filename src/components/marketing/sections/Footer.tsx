"use client";
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            {t("copyright", { year: new Date().getFullYear() })}
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.features")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.solutions")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.marketplace")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.pricing")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.help")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary block duration-150">
              {t("links.about")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
