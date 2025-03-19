
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import { AuthProvider } from '@/hooks/useAuth';

const Signup = () => {
  return (
    <AuthProvider>
      <AuthLayout 
        title="Create an account"
        subtitle="Enter your email below to create your account"
      >
        <SignupForm />
      </AuthLayout>
    </AuthProvider>
  );
};

export default Signup;
