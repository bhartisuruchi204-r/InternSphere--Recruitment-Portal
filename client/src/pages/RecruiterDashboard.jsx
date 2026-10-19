import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Building2,
  MapPin,
  X,
  FileText,
  User,
  Check,
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Applicants Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/jobs/recruiter/my-jobs');
      if (response.data?.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const openApplicantsModal = async (job) => {
    setSelectedJob(job);
    setApplicants([]);
    setApplicantsError('');
    try {
      setLoadingApplicants(true);
      const response = await api.get(`/applications/job/${job._id}`);
      if (response.data?.success) {
        setApplicants(response.data.applications);
      }
    } catch (err) {
      setApplicantsError(err.response?.data?.message || 'Failed to load candidate applications');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      if (response.data?.success) {
        // Update state locally
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting and all its associated applications?')) {
      return;
    }
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      if (response.data?.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job posting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{user?.companyName || 'Recruiter Portal'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your active job postings and evaluate student applicant pipelines
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchRecruiterJobs}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors flex items-center space-x-2 text-xs font-medium"
            title="Refresh Jobs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/recruiter/post-job"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Active Job Postings</div>
            <div className="text-2xl font-extrabold text-white mt-1">{jobs.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Organization</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{user?.companyName || 'Registered Employer'}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Posted Jobs Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching your job postings...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Jobs Posted Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven't created any internship or full-time position listings yet. Click below to publish your first post!
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Job Post</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {job.jobType}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{job.stipend}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.skillsRequired?.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[11px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => openApplicantsModal(job)}
                  className="flex-1 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Review Applicants</span>
                </button>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Job Listing"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Candidate Pipeline
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedJob.company} • {selectedJob.location}
              </p>
            </div>

            {loadingApplicants ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                <p className="text-slate-400 text-sm">Loading applicants list...</p>
              </div>
            ) : applicantsError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {applicantsError}
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-300">No applicants yet</div>
                <div className="text-xs text-slate-500">
                  Student applications submitted for this position will appear here.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  Total Applicants ({applicants.length})
                </div>

                <div className="space-y-3">
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-base">
                            {app.studentId?.name || 'Applicant'}
                          </span>
                          <span className="text-xs text-slate-400">({app.studentId?.email})</span>
                        </div>

                        {app.studentId?.bio && (
                          <p className="text-xs text-slate-400 italic">"{app.studentId.bio}"</p>
                        )}

                        <div className="flex items-center space-x-4 pt-1">
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Candidate Resume</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <span className="text-[11px] text-slate-500">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status Action Controls */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {updatingId === app._id ? (
                          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'Shortlisted')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                                app.status === 'Shortlisted'
                                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-600/30'
                                  : 'bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-800'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Shortlist</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                                app.status === 'Rejected'
                                  ? 'bg-rose-600 text-white border border-rose-500 shadow-md shadow-rose-600/30'
                                  : 'bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-800'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterDashboard;
