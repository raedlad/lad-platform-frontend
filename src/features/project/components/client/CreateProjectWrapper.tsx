import React from 'react'
import CreateProjectHeader from './CreateProjectHeader'

const CreateProjectWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='w-full flex flex-col items-center justify-center gap-6'>
        <CreateProjectHeader />
        {children}
      </div>
    </div>
  )
}

export default CreateProjectWrapper
