import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <div className="card-body gap-4">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-base-content">Create account</h1>
            <p className="text-sm text-base-content/60 mt-1">Start tracking your prep tasks</p>
          </div>

          {/* Error alert */}
          {error && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="form-control">
              <span className="label-text mb-1">Full Name</span>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Password</span>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Confirm Password</span>
              <input
                type="password"
                name="confirm"
                className="input input-bordered w-full"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full mt-1"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center text-base-content/60">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}