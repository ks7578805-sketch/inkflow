import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  return (
    <AuthLayout
      icon={AlertTriangle}
      title="Password reset unavailable"
      subtitle="This flow has not been implemented in the local foundation yet"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to log in
        </Link>
      }
    >
      <p className="text-sm text-foreground text-center">
        Use the seeded owner account for local access during this phase.
      </p>
    </AuthLayout>
  );
}
