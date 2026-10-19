import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 bg-slate-950/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">InternSphere</span>
            <span className="text-xs text-slate-500">• Internship & Recruitment Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <Link to="/jobs" className="hover:text-white transition-colors">Browse Opportunities</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Node.js, MongoDB & React</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
