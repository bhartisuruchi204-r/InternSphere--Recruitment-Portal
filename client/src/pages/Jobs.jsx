import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Send,
  GraduationCap,
} from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');

  // Modal / Detail state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [applicationError, setApplicationError] = useState('');

  const { user, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;

      const response = await api.get('/jobs', { params });
      if (response.data?.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setSearchParams({});
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setApplicationSuccess('');
    setApplicationError('');
  };

  const openApplyModal = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      alert('Only students can apply for jobs. Please register or log in as a student.');
      return;
    }
    setSelectedJob(job);
    setResumeUrl(user?.resumeUrl || '');
    setApplicationSuccess('');
    setApplicationError('');
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplicationError('');
    setApplicationSuccess('');

    if (!resumeUrl) {
      setApplicationError('Please provide a valid resume URL');
      return;
    }

    try {
      setApplying(true);
      const response = await api.post('/applications/apply', {
        jobId: selectedJob._id,
        resumeUrl,
      });

      if (response.data?.success) {
        setApplicationSuccess('Application submitted successfully!');
        setTimeout(() => {
          setApplyModalOpen(false);
          setSelectedJob(null);
        }, 1800);
      }
    } catch (err) {
      setApplicationError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Explore Opportunities
          </h1>
          <p className="text-slate-400 text-sm">
            Discover internships and full-time roles from innovative technology companies
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-indigo-400 bg-indigo-500/10 px-4 py-2.5 rounded-xl border border-indigo-500/20 self-start md:self-auto">
          <GraduationCap className="w-4 h-4" />
          <span>{jobs.length} Positions Available</span>
        </div>
      </div>

      {/* Filters Bar */}
      <form onSubmit={handleFilterSubmit} className="glass-panel p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Title, skills, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="City or Remote..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center space-x-1.5"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          {(search || location || jobType) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Main Jobs Listing Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching job listings...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No jobs found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Try adjusting your search criteria or clearing active filters to see all available opportunities.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                      job.jobType === 'Internship'
                        ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {job.jobType}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Job Title & Company */}
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
                  {job.title}
                </h3>
                <div className="flex items-center space-x-2 text-slate-400 text-sm mb-4">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium">{job.company}</span>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{job.stipend}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.skillsRequired?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[11px] font-medium border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => openJobDetails(job)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => openApplyModal(job)}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all text-center flex items-center justify-center space-x-1"
                >
                  <span>Apply Now</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && !applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {selectedJob.jobType}
              </span>
              <h2 className="text-2xl font-bold text-white mt-3 mb-1">{selectedJob.title}</h2>
              <div className="flex items-center space-x-2 text-indigo-300 text-sm font-semibold">
                <Building2 className="w-4 h-4" />
                <span>{selectedJob.company}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Location</div>
                <div className="text-sm font-medium text-slate-200 mt-0.5">{selectedJob.location}</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Stipend / Salary</div>
                <div className="text-sm font-semibold text-emerald-400 mt-0.5">{selectedJob.stipend}</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Posted Date</div>
                <div className="text-sm font-medium text-slate-200 mt-0.5">
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skillsRequired?.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {selectedJob.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => openApplyModal(selectedJob)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
              >
                <span>Apply for Position</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Application Submit Modal */}
      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative space-y-5">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Apply to {selectedJob.title}</h3>
              <p className="text-xs text-indigo-400 font-medium mt-1">{selectedJob.company}</p>
            </div>

            {applicationSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{applicationSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {applicationError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{applicationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Resume Document Link (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/... or PDF URL"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Provide a public Google Drive, Dropbox, or PDF link for the recruiter to review.
                  </p>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-900 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md shadow-indigo-600/30 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Jobs;
