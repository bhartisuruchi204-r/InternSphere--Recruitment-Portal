import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/applications/student');
      if (response.data?.success) {
        setApplications(response.data.applications);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch application records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Shortlisted</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case 'Applied':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm) return true;
    const title = app.jobId?.title?.toLowerCase() || '';
    const company = app.jobId?.company?.toLowerCase() || '';
    return title.includes(searchTerm.toLowerCase()) || company.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track real-time updates and decisions for your submitted job applications
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchApplications}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors flex items-center space-x-2 text-xs font-medium"
            title="Refresh Applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/jobs"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            Find More Jobs
          </Link>
        </div>
      </div>

      {/* Search & Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Applications</div>
          <div className="text-2xl font-extrabold text-white mt-1">{applications.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 font-semibold uppercase">Shortlisted</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {applications.filter((a) => a.status === 'Shortlisted').length}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 font-semibold uppercase">Pending Review</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">
            {applications.filter((a) => a.status === 'Applied').length}
          </div>
        </div>
      </div>

      {/* Main Table / Applications List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Applications Submitted Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven't submitted any job applications yet. Browse active listings and apply to launch your career!
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
          >
            Browse Internship Listings
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Table Header Filter */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter applications by company or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Showing {filteredApplications.length} entry/entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3.5 px-6">Job Position</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Stipend</th>
                  <th className="py-3.5 px-6">Applied On</th>
                  <th className="py-3.5 px-6">Submitted Resume</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {app.jobId?.title || 'Unknown Position'}
                      <div className="text-xs text-slate-400 font-normal">
                        {app.jobId?.jobType || 'Internship'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>{app.jobId?.company || 'Organization'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-emerald-400">
                      {app.jobId?.stipend || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 underline"
                        >
                          <span>View Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Not provided</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
