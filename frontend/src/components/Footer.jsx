import { Mail, MapPin } from 'lucide-react';
import PPSUBranding from './PPSUBranding.jsx';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <PPSUBranding 
              size="medium" 
              showText={true} 
              showNAAC={true}
              className="text-white"
            />
            <p className="text-neutral-400">
              Connect with the PPSU community. Share moments, build connections, and stay updated with campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="/feed" className="hover:text-white transition-colors">Feed</a></li>
              <li><a href="/create-post" className="hover:text-white transition-colors">Create Post</a></li>
              <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@ppsu.ac.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>P P Savani University</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 PPSU Social. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
