"use client";
import { Button } from '@/shared/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function CTA() {
    const t = useTranslations("cta");
    return (
        <section>
            <div className="py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="w-full flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">{t("title")}</h2>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                asChild
                                size="lg">
                                <Link href="#">{t("getStarted")}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}