import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  PlusCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300 tracking-tight">
                InternSphere
              </span>
              <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase -mt-1">
                Recruitment Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                isActive('/jobs')
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Jobs</span>
            </Link>

            {isAuthenticated && isStudent && (
              <Link
                to="/student/applications"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                  isActive('/student/applications')
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Applications</span>
              </Link>
            )}

            {isAuthenticated && isRecruiter && (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                    isActive('/recruiter/dashboard')
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/recruiter/post-job"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                    isActive('/recruiter/post-job')
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Job</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Profile / Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-semibold text-xs border border-indigo-500/30">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Browse Jobs
          </Link>

          {isAuthenticated && isStudent && (
            <Link
              to="/student/applications"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              My Applications
            </Link>
          )}

          {isAuthenticated && isRecruiter && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-emerald-500/10"
              >
                Post a Job
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{user?.name}</div>
                    <div className="text-xs text-indigo-400 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 rounded-md border border-rose-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
