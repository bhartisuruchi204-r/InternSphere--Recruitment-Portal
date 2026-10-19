import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Code,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || '',
    location: 'Remote',
    stipend: '$2,000 / month',
    jobType: 'Internship',
    skillsRequired: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.company || !formData.location || !formData.stipend || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/jobs', formData);

      if (response.data?.success) {
        setSuccess('Job opportunity posted successfully!');
        setTimeout(() => {
          navigate('/recruiter/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Recruiter Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Post a New Job Opportunity
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Fill out the position details to start receiving qualified student applications
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Frontend Engineering Intern"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="e.g. Acme Tech Labs"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Remote / New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Stipend / Salary *
              </label>
              <div className="relative">
                <DollarSign className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="stipend"
                  required
                  placeholder="e.g. $3,500 / month or $80,000 / yr"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Employment Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Required Skills (Comma separated) *
              </label>
              <div className="relative">
                <Code className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="skillsRequired"
                  required
                  placeholder="e.g. React, Node.js, TypeScript, Tailwind"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Detailed Position Description & Requirements *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              placeholder="Describe candidate responsibilities, qualifications, stack details, and working culture..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Job Opportunity</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default PostJob;
