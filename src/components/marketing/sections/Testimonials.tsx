"use client";
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslations } from 'next-intl'

export default function Testimonials() {
    const t = useTranslations("testimonials");
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                {/* Section Heading */}
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">
                          {t("title")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    {/* Contractor */}
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                            <img
                                className="h-6 w-fit dark:invert"
                                src="/logos/contractor.svg" 
                                alt="Contractor Logo"
                                height="24"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    {t("testimonial1.quote")}
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/avatars/contractor1.jpg"
                                            alt="Ahmed Khalid"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AK</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">{t("testimonial1.name")}</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            {t("testimonial1.role")}
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Engineer */}
                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    {t("testimonial2.quote")}
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/avatars/engineer1.jpg"
                                            alt="Mona Al-Sayed"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>MA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">{t("testimonial2.name")}</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            {t("testimonial2.role")}
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Supplier */}
                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    {t("testimonial3.quote")}
                                </p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/avatars/supplier1.jpg"
                                            alt="Hassan Ali"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>HA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">{t("testimonial3.name")}</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            {t("testimonial3.role")}
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Client / Individual */}
                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    {t("testimonial4.quote")}
                                </p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/avatars/client1.jpg"
                                            alt="Sara Mohammed"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>SM</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{t("testimonial4.name")}</p>
                                        <span className="text-muted-foreground block text-sm">
                                            {t("testimonial4.role")}
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
