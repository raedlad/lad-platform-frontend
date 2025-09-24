// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@shared/components/ui/card";
// import { useTranslations } from "next-intl";
// import { motion, useInView } from "motion/react";
// import { useRef } from "react";

// type Testimonial = {
//   name: string;
//   role: string;
//   image: string;
//   quote: string;
// };

// export default function WallOfLoveSection() {
//   const t = useTranslations("testimonials");
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   const testimonials: Testimonial[] = [
//     {
//       name: t("testimonial1.name"),
//       role: t("testimonial1.role"),
//       image: "https://randomuser.me/api/portraits/men/1.jpg",
//       quote: t("testimonial1.quote"),
//     },
//     {
//       name: t("testimonial2.name"),
//       role: t("testimonial2.role"),
//       image: "https://randomuser.me/api/portraits/men/6.jpg",
//       quote: t("testimonial2.quote"),
//     },
//     {
//       name: t("testimonial3.name"),
//       role: t("testimonial3.role"),
//       image: "https://randomuser.me/api/portraits/men/7.jpg",
//       quote: t("testimonial3.quote"),
//     },
//     {
//       name: t("testimonial4.name"),
//       role: t("testimonial4.role"),
//       image: "https://randomuser.me/api/portraits/men/8.jpg",
//       quote: t("testimonial4.quote"),
//     },
//     {
//       name: t("testimonial5.name"),
//       role: t("testimonial5.role"),
//       image: "https://randomuser.me/api/portraits/men/4.jpg",
//       quote: t("testimonial5.quote"),
//     },
//     {
//       name: t("testimonial6.name"),
//       role: t("testimonial6.role"),
//       image: "https://randomuser.me/api/portraits/men/2.jpg",
//       quote: t("testimonial6.quote"),
//     },
//     {
//       name: t("testimonial7.name"),
//       role: t("testimonial7.role"),
//       image: "https://randomuser.me/api/portraits/men/5.jpg",
//       quote: t("testimonial7.quote"),
//     },
//   ];

//   const chunkArray = (
//     array: Testimonial[],
//     chunkSize: number
//   ): Testimonial[][] => {
//     const result: Testimonial[][] = [];
//     for (let i = 0; i < array.length; i += chunkSize) {
//       result.push(array.slice(i, i + chunkSize));
//     }
//     return result;
//   };

//   const testimonialChunks = chunkArray(
//     testimonials,
//     Math.ceil(testimonials.length / 4)
//   );

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const chunkVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//     },
//   };

//   const hoverVariants = {
//     hover: {
//       y: -4,
//       scale: 1.02,
//       transition: {
//         duration: 0.2,
//         ease: "easeOut",
//       },
//     },
//   };
//   return (
//     <section ref={ref}>
//       <div className="py-16 md:py-32">
//         <div className="mx-auto max-w-6xl px-6">
//           <motion.div
//             className="text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             <h2 className="text-3xl font-semibold">{t("title")}</h2>
//           </motion.div>

//           <motion.div
//             className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3"
//             variants={containerVariants}
//             initial="hidden"
//             animate={isInView ? "visible" : "hidden"}
//           >
//             {testimonialChunks.map((chunk, chunkIndex) => (
//               <motion.div
//                 key={chunkIndex}
//                 className="space-y-3"
//                 variants={chunkVariants}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//               >
//                 {chunk.map(({ name, role, quote, image }, index) => (
//                   <motion.div
//                     key={index}
//                     variants={cardVariants}
//                     whileHover="hover"
//                     transition={{ duration: 0.5, ease: "easeOut" }}
//                     className="group"
//                   >
//                     <Card className="transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
//                       <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
//                         <motion.div
//                           whileHover={{ scale: 1.1 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           <Avatar className="size-9">
//                             <AvatarImage
//                               alt={name}
//                               src={image}
//                               loading="lazy"
//                               width="120"
//                               height="120"
//                             />
//                             <AvatarFallback>ST</AvatarFallback>
//                           </Avatar>
//                         </motion.div>

//                         <div>
//                           <motion.h3
//                             className="font-medium"
//                             initial={{ opacity: 0 }}
//                             animate={isInView ? { opacity: 1 } : { opacity: 0 }}
//                             transition={{
//                               delay: 0.3 + chunkIndex * 0.1 + index * 0.05,
//                             }}
//                           >
//                             {name}
//                           </motion.h3>

//                           <motion.span
//                             className="text-muted-foreground block text-sm tracking-wide"
//                             initial={{ opacity: 0 }}
//                             animate={isInView ? { opacity: 1 } : { opacity: 0 }}
//                             transition={{
//                               delay: 0.4 + chunkIndex * 0.1 + index * 0.05,
//                             }}
//                           >
//                             {role}
//                           </motion.span>

//                           <motion.blockquote
//                             className="mt-3"
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={
//                               isInView
//                                 ? { opacity: 1, y: 0 }
//                                 : { opacity: 0, y: 10 }
//                             }
//                             transition={{
//                               delay: 0.5 + chunkIndex * 0.1 + index * 0.05,
//                             }}
//                           >
//                             <p className="text-gray-700 dark:text-gray-300">
//                               {quote}
//                             </p>
//                           </motion.blockquote>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { useTranslations } from "next-intl";
import React from "react";

const Testimonials = () => {
  const t = useTranslations("testimonials");
  const items = [
    {
      quote: t("testimonial1.quote"),
      name: t("testimonial1.name"),
      title: t("testimonial1.role"),
    },
    {
      quote: t("testimonial2.quote"),
      name: t("testimonial2.name"),
      title: t("testimonial2.role"),
    },
    {
      quote: t("testimonial3.quote"),
      name: t("testimonial3.name"),
      title: t("testimonial3.role"),
    },
    {
      quote: t("testimonial4.quote"),
      name: t("testimonial4.name"),
      title: t("testimonial4.role"),
    },
    {
      quote: t("testimonial5.quote"),
      name: t("testimonial5.name"),
      title: t("testimonial5.role"),
    },
    {
      quote: t("testimonial6.quote"),
      name: t("testimonial6.name"),
      title: t("testimonial6.role"),
    },
    {
      quote: t("testimonial7.quote"),
      name: t("testimonial7.name"),
      title: t("testimonial7.role"),
    },
  ];
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto" dir="ltr">
      <InfiniteMovingCards
        items={items}
        direction="left"
        speed="normal"
        pauseOnHover={true}
      />
      <InfiniteMovingCards
        items={items}
        direction="right"
        speed="normal"
        pauseOnHover={true}
      />
    </div>
  );
};

export default Testimonials;
