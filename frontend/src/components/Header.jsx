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
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <PPSUBranding size="medium" showText={true} />
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="flex-1 max-w-md mx-8">
              <SearchBar placeholder="Search PPSU Social..." />
            </div>
          )}

          {/* Navigation */}
          {isAuthenticated ? (
            <nav className="flex items-center space-x-2">
              <Link 
                to="/feed" 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Feed</span>
              </Link>
              
              <Link 
                to="/stories" 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
              >
                <Circle className="h-5 w-5" />
                <span className="font-medium">Stories</span>
              </Link>
              
              <Link 
                to="/create-post" 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Create</span>
              </Link>
              
              <Link 
                to={`/profile/${user?.id}`} 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-accent-600 hover:bg-accent-50/80 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-6 py-2 text-slate-600 hover:text-primary-600 font-medium transition-colors duration-300"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary"
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
