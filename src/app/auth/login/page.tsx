import { Suspense } from "react";
import LoginForm from "./LoginForm";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-purple-600 text-lg">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}