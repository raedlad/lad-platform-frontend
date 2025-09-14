"use client";
import React from 'react'
import { useProjectStore } from '../../store/projectStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const CreateProjectHeader = () => {
  const t = useTranslations("");
  const store = useProjectStore();
  const currentStep = store.currentStep;
  const totalSteps = store.totalSteps;

  return (
    <div className='w-full flex  justify-between'>
    <div className='w-full flex flex-col gap-2 max-w-sm'>
      <h1 className='text-2xl font-bold'> {t("project.title")} </h1>
      <p className=''>{t("project.description")}</p>
    </div>
    {currentStep === 1 && (
    <Link href={"/dashboard/individual/projects"}>
    <Button variant="outline" size="sm" className='border-design-main text-design-main px-6'>
      {t("common.actions.back")}
      <ArrowLeft className='h-4 w-4' />
    </Button>
    </Link>
    )}
    </div>
  )
}

export default CreateProjectHeader
