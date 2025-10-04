import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, Hash, Calendar, MapPin, Filter, SortAsc } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import searchApi from '../services/searchApi.js';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchApi.searchAll(searchQuery, {
        type: activeFilter,
        sort: sortBy
      });
      setResults(response.results || {});
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (activeFilter === 'all') {
      return {
        users: results.users,
        posts: results.posts,
        hashtags: results.hashtags,
        events: results.events
      };
    }
    return { [activeFilter]: results[activeFilter] || [] };
  };

  const renderUserCard = (user) => (
    <div key={user.id} className="card-modern p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-slate-900">{user.name}</h3>
            {user.isVerified && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-600">{user.role} • {user.department}</p>
          <p className="text-xs text-slate-500">{user.followers} followers</p>
        </div>
        <button className="btn-outline px-4 py-2 text-sm">
          Follow
        </button>
      </div>
    </div>
  );

  const renderPostCard = (post) => (
    <div key={post.id} className="card-modern p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
          {post.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-slate-900">{post.author}</h4>
            <span className="text-sm text-slate-500">•</span>
            <span className="text-sm text-slate-500">{post.createdAt}</span>
          </div>
          <p className="text-slate-700 mb-3">{post.content}</p>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHashtagCard = (hashtag) => (
    <div key={hashtag.name} className="card-modern p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{hashtag.name}</h3>
            <p className="text-sm text-slate-600">{hashtag.posts} posts</p>
          </div>
        </div>
        {hashtag.trending && (
          <span className="px-2 py-1 bg-accent-100 text-accent-600 text-xs font-semibold rounded-full">
            Trending
          </span>
        )}
      </div>
    </div>
  );

  const renderEventCard = (event) => (
    <div key={event.id} className="card-modern p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">{event.attendees} attendees</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm">
          RSVP
        </button>
      </div>
    </div>
  );

  const filteredResults = getFilteredResults();
  const totalResults = Object.values(filteredResults).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="mb-6">
            <SearchBar placeholder="Search PPSU Social..." className="max-w-2xl" />
          </div>
          
          {query && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Search results for "{query}"
              </h1>
              <span className="text-slate-600">
                {loading ? 'Searching...' : `${totalResults} results found`}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : query ? (
          <>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filter:</span>
              </div>
              {['all', 'users', 'posts', 'hashtags', 'events'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="space-y-6">
              {activeFilter === 'all' || activeFilter === 'users' ? (
                filteredResults.users.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary-500" />
                      <span>People ({filteredResults.users.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResults.users.map(renderUserCard)}
                    </div>
                  </div>
                )
              ) : null}

              {activeFilter === 'all' || activeFilter === 'posts' ? (
                filteredResults.posts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Search className="h-5 w-5 text-accent-500" />
                      <span>Posts ({filteredResults.posts.length})</span>
                    </h2>
                    <div className="space-y-4">
                      {filteredResults.posts.map(renderPostCard)}
                    </div>
                  </div>
                )
              ) : null}

              {activeFilter === 'all' || activeFilter === 'hashtags' ? (
                filteredResults.hashtags.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Hash className="h-5 w-5 text-success-500" />
                      <span>Hashtags ({filteredResults.hashtags.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResults.hashtags.map(renderHashtagCard)}
                    </div>
                  </div>
                )
              ) : null}

              {activeFilter === 'all' || activeFilter === 'events' ? (
                filteredResults.events.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-warning-500" />
                      <span>Events ({filteredResults.events.length})</span>
                    </h2>
                    <div className="space-y-4">
                      {filteredResults.events.map(renderEventCard)}
                    </div>
                  </div>
                )
              ) : null}

              {totalResults === 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-600">Try searching with different keywords or check your spelling.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Search PPSU Social</h3>
            <p className="text-slate-600">Find people, posts, events, and more in your PPSU community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
