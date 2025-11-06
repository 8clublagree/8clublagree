"use client";

import "react-quill/dist/quill.snow.css";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import UserTermsAndConditions from "@/components/layout/UserTermsAndConditions";

const TermsAndConditionsManager = () => {
  return (
    <AuthenticatedLayout>
      <UserTermsAndConditions />
    </AuthenticatedLayout>
  );
};

export default TermsAndConditionsManager;
