import React from 'react'
import DocumentUpload from '../common/file-upload/DocumentUpload'

const IndividualDocumentUpload = () => {
  return (
    <DocumentUpload
      role="INDIVIDUAL"
      title="Individual Document Upload"
      description="Upload the required documents for your individual account verification."
    />
  )
}

export default IndividualDocumentUpload
