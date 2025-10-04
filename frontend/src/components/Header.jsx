import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { authApi } from '../services/authApi.js';
import { Home, Plus, User, LogOut, Circle } from 'lucide-react';
import PPSUBranding from './PPSUBranding.jsx';
import SearchBar from './SearchBar.jsx';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <PPSUBranding size="medium" showText={true} showNAAC={false} className="hidden sm:flex" />
            <PPSUBranding size="small" showText={false} showNAAC={false} className="sm:hidden" />
          </Link>

          {/* Search Bar - Hidden on mobile, visible on tablet and up */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <SearchBar placeholder="Search PPSU Social..." />
            </div>
          )}

          {/* Navigation */}
          {isAuthenticated ? (
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile: Icon only, Desktop: Icon + Text */}
              <Link 
                to="/feed" 
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
                title="Feed"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Feed</span>
              </Link>
              
              <Link 
                to="/stories" 
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
                title="Stories"
              >
                <Circle className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Stories</span>
              </Link>
              
              <Link 
                to="/create-post" 
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
                title="Create Post"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Create</span>
              </Link>
              
              <Link 
                to={`/profile/${user?.id}`} 
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
                title="Profile"
              >
                <User className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Profile</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl text-slate-600 hover:text-accent-600 hover:bg-accent-50/80 transition-all duration-300 hover:scale-105"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Logout</span>
              </button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/login" 
                className="px-3 sm:px-6 py-2 text-slate-600 hover:text-primary-600 font-medium transition-colors duration-300 text-sm sm:text-base"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary text-sm sm:text-base px-3 sm:px-6 py-2"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
