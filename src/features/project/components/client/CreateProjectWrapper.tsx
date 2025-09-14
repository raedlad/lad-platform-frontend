import React from 'react'
import CreateProjectHeader from './CreateProjectHeader'

const CreateProjectWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full '>
      <div className='w-full flex flex-col gap-6'>
        <CreateProjectHeader />
        {children}
      </div>
    </div>
  )
}

export default CreateProjectWrapper
