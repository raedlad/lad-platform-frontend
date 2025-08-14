'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { RoleSelectorForm } from '@auth/components/forms';
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamically import the flows for performance
const ContractorRegistration = dynamic(() => import('@/features/authentication/flows/contractor-registration/ContractorRegistration'));
const FreelanceEngineerRegistration = dynamic(() => import('@/features/authentication/flows/freelance-engineer-registration/FreelanceEngineerRegistration'));
// ... import other flows

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const renderContent = () => {
    // If no role is selected, show the RoleSelectorForm
    if (!selectedRole) {
      return <RoleSelectorForm selectedRole={selectedRole} onSelectRole={setSelectedRole} />;
    }

    // Once a role is selected, render the corresponding form
    switch (selectedRole) {
      case 'contractor':
        return <ContractorRegistration />;
      case 'freelance-engineer':
        return <FreelanceEngineerRegistration />;
      // ... other cases
      default:
        // Fallback to the selector if the role is invalid
        return <RoleSelectorForm selectedRole={selectedRole} onSelectRole={setSelectedRole} />;
    }
  };

  return (
    <div className="container py-8">
      <Suspense fallback={<div> loading </div>}>
        {renderContent()}
      </Suspense>
    </div>
  );
}
