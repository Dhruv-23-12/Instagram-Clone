import { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Hash, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import searchApi from '../services/searchApi.js';
import toast from 'react-hot-toast';

const SearchBar = ({ placeholder = "Search PPSU Social...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await searchApi.getSuggestions(query);
          setSuggestions(response.suggestions || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery = query) => {
    if (searchQuery.trim()) {
      try {
        // Save search query
        await searchApi.saveSearch(searchQuery);
        
        // Add to recent searches
        const newRecent = [searchQuery, ...recentSearches.filter(item => item !== searchQuery)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
        
        // Navigate to search results
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsOpen(false);
        setQuery('');
      } catch (error) {
        console.error('Error saving search:', error);
        // Still navigate even if save fails
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsOpen(false);
        setQuery('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.name);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-primary-500" />;
      case 'hashtag':
        return <Hash className="h-4 w-4 text-accent-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-success-500" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-warning-500" />;
      default:
        return <Search className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case 'user':
        return 'hover:bg-primary-50 border-primary-100';
      case 'hashtag':
        return 'hover:bg-accent-50 border-accent-100';
      case 'event':
        return 'hover:bg-success-50 border-success-100';
      case 'location':
        return 'hover:bg-warning-50 border-warning-100';
      default:
        return 'hover:bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-slate-400 shadow-soft"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-large z-50 overflow-hidden">
          {query.length > 0 ? (
            <>
              {/* Search Suggestions */}
              {suggestions.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors duration-200 ${getSuggestionColor(suggestion.type)}`}
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {suggestion.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-slate-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <Search className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Quick Search Options */}
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Quick Search
                </div>
                <button
                  onClick={() => handleSearch('professors')}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-primary-50 transition-colors duration-200"
                >
                  <Users className="h-4 w-4 text-primary-500" />
                  <span className="text-slate-700">Find Professors</span>
                </button>
                <button
                  onClick={() => handleSearch('events')}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-success-50 transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4 text-success-500" />
                  <span className="text-slate-700">Browse Events</span>
                </button>
                <button
                  onClick={() => handleSearch('trending')}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-accent-50 transition-colors duration-200"
                >
                  <Hash className="h-4 w-4 text-accent-500" />
                  <span className="text-slate-700">Trending Topics</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
