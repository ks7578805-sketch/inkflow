import React from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  return (
    <AuthLayout
      icon={UserPlus}
      title="Registration unavailable"
      subtitle="User creation will be added in a future phase"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <p className="text-sm text-foreground text-center">
        Use the seeded owner account for local access during this foundation phase.
      </p>
    </AuthLayout>
  );
}
