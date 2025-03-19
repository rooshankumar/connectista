
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <AuthLayout 
      title="Create an account"
      subtitle="Enter your email below to create your account"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
