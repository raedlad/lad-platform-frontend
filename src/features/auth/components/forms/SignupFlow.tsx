'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { RoleSelectorForm } from '@auth/components/forms';

const IndividualRegistration = dynamic(() => import('@auth/flows/individual/IndividualRegistration'));
const InstitutionRegistration = dynamic(() => import('@auth/flows/institution/InstitutionRegistration'));
const FreelanceEngineerRegistration = dynamic(() => import('@auth/flows/freelance-engineer/FreelanceEngineerRegistration'));
const EngineeringOfficeRegistration = dynamic(() => import('@auth/flows/engineering-office/EngineeringOfficeRegistration'));
const ContractorRegistration = dynamic(() => import('@auth/flows/contractor/ContractorRegistration'));
const SupplierRegistration = dynamic(() => import('@auth/flows/supplier/SupplierRegistration'));


export default function SignUpForm() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const [isRoleConfirmed, setIsRoleConfirmed] = useState(false);
  const handleContinue = () => {
    if (selectedRole) {
      setIsRoleConfirmed(true);
    }
    console.log(`${selectedRole}`)
  };
  const renderContent = () => {
    if (!isRoleConfirmed) {
      return (
        <RoleSelectorForm
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole} 
          onContinue={handleContinue} 
        />
      );
    }

    switch (selectedRole) {
      case 'individual':
        return <IndividualRegistration />;
      case 'institution':
        return <InstitutionRegistration />;
      case 'freelance-engineer':
        return <FreelanceEngineerRegistration />;
      case 'engineering-office':
        return <EngineeringOfficeRegistration />;
      case 'contractor':
        return <ContractorRegistration />;
      case 'supplier':
        return <SupplierRegistration />;
      default:
        setIsRoleConfirmed(false);
        return <RoleSelectorForm selectedRole={null} onSelectRole={setSelectedRole} onContinue={handleContinue} />;
    }
  };

  return (
    <div className="w-full container mx-auto">
      <Suspense fallback={<div>loading</div>}>
        {renderContent()}
      </Suspense>
    </div>
  );
}
