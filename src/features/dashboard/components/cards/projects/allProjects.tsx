import { assets } from '@/constants/assets'
import React from 'react'
import Image from 'next/image'

const allProjects = () => {
  return (
    <div className='w-full flex flex-col gap-2 border border-[#AFAFAF] rounded-md p-6 shadow-sm'>
      <h1 className='text-lg font-semibold'>مجمع سكني</h1>
      <p className='text-xs text-design-gray flex items-center gap-2'>
        <Image src={assets.subLocation} alt='location' width={16} height={16} />
        <span>حي النرجس - شارع الهاشمية</span>
      </p>
      <p>لدي مجمع سكني يحتوي على15 شقة سكنية احتاج مقاول محترف لمعرفة تفاصيل وكل ما يلزم </p>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Image src={assets.calender} alt='calender' width={16} height={16} />
          <span className='text-sm text-design-gray'>تاريخ البدء :15/5/2025</span>
        </div>
        <div className='flex items-center gap-2'>
          <Image src={assets.subPayment} alt='subPayment' width={16} height={16} />
          <span className='text-sm text-design-gray'>850 ريال </span>
        </div>
        <div>
          <p className='text-sm text-design-gray'> نسبة الانجاز : <span className='text-design-green'>80%</span></p>
        </div>
        <button className='text-design-main text-sm px-6 py-1 border border-design-main rounded-sm'>معرفة المزيد</button>
      </div>
      
    </div>
  )
}

export default allProjects
