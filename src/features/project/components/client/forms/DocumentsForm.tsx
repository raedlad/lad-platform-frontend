import React from 'react'
import NavigationButtons from '../../common/NavigationButtons'

const DocumentsForm = () => {
  return (
    <div>
      Documents Form
      <NavigationButtons
        onSubmit={() => console.log('submit')}
        isLoading={false}
      />
    </div>
  )
}

export default DocumentsForm
