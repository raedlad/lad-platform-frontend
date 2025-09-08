"use client";

import React from "react";
import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import { useAuthStore } from "../store/authStore";

const PersonalInfoStep: React.FC = () => {
  const store = useAuthStore();
  const role = store.currentRole;
  return <PersonalInfoForm role={role!} />;
};

export default PersonalInfoStep;
