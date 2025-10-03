import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { authApi } from '@/features/auth/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await authApi.register(form);
      setToken(accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-0 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">First name</label>
              <Input name="firstName" value={form.firstName} onChange={onChange} required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Last name</label>
              <Input name="lastName" value={form.lastName} onChange={onChange} required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <Input type="email" name="email" value={form.email} onChange={onChange} required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <Input type="password" name="password" value={form.password} onChange={onChange} required />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            Have an account? <Link to="/login" className="text-primary">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;


