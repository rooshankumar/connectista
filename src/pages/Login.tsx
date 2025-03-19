
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/hooks/useAuth';

const Login = () => {
  return (
    <AuthProvider>
      <AuthLayout 
        title="Welcome back"
        subtitle="Enter your email to sign in to your account"
      >
        <LoginForm />
      </AuthLayout>
    </AuthProvider>
  );
};

export default Login;
