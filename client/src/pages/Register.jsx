import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Building2,
  FileText,
  UserCheck,
  AlertCircle,
  Loader2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    companyName: '',
    resumeUrl: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleToggle = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, role } = formData;
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/jobs');
    } catch (err) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create an Account</h2>
          <p className="text-slate-400 text-sm mt-1">
            Join InternSphere as a Student or Recruiter
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="mb-6 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleRoleToggle('student')}
            className={`py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
              formData.role === 'student'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>I am a Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle('recruiter')}
            className={`py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
              formData.role === 'recruiter'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>I am a Recruiter</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="alex@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Conditional Recruiter Field */}
          {formData.role === 'recruiter' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company / Organization Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Acme Tech Innovations"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Conditional Student Field */}
          {formData.role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Resume Link (PDF / Google Drive / LinkedIn)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <input
                  type="url"
                  name="resumeUrl"
                  placeholder="https://drive.google.com/your-resume"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 px-4 text-white font-semibold rounded-xl text-sm shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 ${
              formData.role === 'recruiter'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Register as {formData.role === 'recruiter' ? 'Recruiter' : 'Student'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-800/80 pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
