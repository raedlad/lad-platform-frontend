"use client";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import React, { useEffect } from 'react'
import { useProjectStore } from '@/features/project/store/projectStore'
import { projectApi } from '../../services/projectApi';

const ProjectType = ({ onSelect }: { onSelect: (value: number) => void }) => {
  const { projectTypes, setProjectTypes } = useProjectStore();
  useEffect(() => {
    if (projectTypes) return;
    const fetchProjectTypes = async () => {
      const result = await projectApi.getProjectTypes();
      if (result.success) {
        setProjectTypes(result.response);
      }
    };
    fetchProjectTypes();
  }, []);
  return (
    <Select onValueChange={(value) => {
        onSelect(parseInt(value));
    }} >
        <SelectTrigger className='w-full'>
            <SelectValue placeholder="Select a project type" className='w-full'/>
        </SelectTrigger>
        <SelectContent className='w-full'>
            {projectTypes?.map((projectType) => (
                <SelectItem key={projectType.id} value={projectType.id.toString()}>{projectType.name}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}

export default ProjectType
