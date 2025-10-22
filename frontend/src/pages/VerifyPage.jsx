import React from "react";
import { useSearchParams, Link } from "react-router-dom";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        {status === "success" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Email Verified!</h1>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now log in.
            </p>
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or expired. Please request a new one.
            </p>
            <Link
              to="/resend-verification"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Resend Verification
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
