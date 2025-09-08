export const enumConvert = (enumKey: string) => {
  const apiEnum: Record<string, string> = {
    INDIVIDUAL: "individual",
    CONTRACTOR: "contractor",
    ENGINEERING_OFFICE: "engineering_office",
    FREELANCE_ENGINEER: "freelance_engineer",
    ORGANIZATION: "organization",
    SUPPLIER: "supplier",
  };
  return apiEnum[enumKey]; 
};
