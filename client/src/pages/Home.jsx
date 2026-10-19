import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (locationTerm) query.append('location', locationTerm);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glowing background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Connecting Top Students with World-Class Internships</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Launch Your Career with Top{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              Internships & Jobs
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Empowering students to land dream roles and enabling companies to hire top-tier talent with speed and transparency.
          </p>

          {/* Search Bar Container */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel p-2.5 sm:p-3 rounded-2xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2.5 shadow-2xl shadow-indigo-950/50 border border-slate-700/60"
          >
            <div className="flex items-center space-x-3 px-3 py-2 w-full md:w-1/2 bg-slate-900/80 rounded-xl border border-slate-800 focus-within:border-indigo-500/60 transition-colors">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 px-3 py-2 w-full md:w-5/12 bg-slate-900/80 rounded-xl border border-slate-800 focus-within:border-indigo-500/60 transition-colors">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Location or Remote..."
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <span className="font-medium">Trending searches:</span>
            {['Software Engineer', 'Data Science', 'Product Designer', 'Remote Internship', 'Frontend'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-white mb-1">2,500+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Opportunities</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800/80">
            <div className="text-3xl font-extrabold text-indigo-400 mb-1">800+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Verified Companies</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800/80">
            <div className="text-3xl font-extrabold text-emerald-400 mb-1">15,000+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Students Placed</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800/80">
            <div className="text-3xl font-extrabold text-violet-400 mb-1">98%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">
            Designed for Both Talent and Recruiters
          </h2>
          <p className="text-slate-400 text-base">
            Streamlining candidate discovery and internship placements with real-time status tracking and seamless communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* For Students Card */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">For Students</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Find verified internships, submit applications with a single click, and get real-time feedback on your candidate status.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant profile resume submission</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live status tracking (Shortlisted, Applied, Rejected)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Filter by stipend, remote, and full-time options</span>
              </li>
            </ul>
            <Link
              to="/register?role=student"
              className="inline-flex items-center space-x-2 text-indigo-400 font-semibold text-sm hover:text-indigo-300 group-hover:translate-x-1 transition-all"
            >
              <span>Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* For Recruiters Card */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">For Recruiters & Employers</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Post internship listings in minutes, review applicant resumes, and manage candidate pipelines efficiently.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Effortless job posting & skills tagging</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Centralized dashboard to evaluate candidate profiles</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click shortlisting and decision management</span>
              </li>
            </ul>
            <Link
              to="/register?role=recruiter"
              className="inline-flex items-center space-x-2 text-emerald-400 font-semibold text-sm hover:text-emerald-300 group-hover:translate-x-1 transition-all"
            >
              <span>Post Opportunities Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-violet-900/60 p-8 sm:p-12 text-center border border-indigo-500/30">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to take the next step in your career journey?
            </h2>
            <p className="text-slate-300 text-base mb-8">
              Join thousands of students and recruiters matching for internships every single day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
              >
                Create Free Account
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all text-sm"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
