import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RefreshCw, Plus, Filter, TrendingUp } from 'lucide-react';
import PostCard from './PostCard.jsx';
import CreatePostModal from './CreatePostModal.jsx';
import { postApi } from '../services/postApi.js';
import toast from 'react-hot-toast';

const Feed = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, following, trending
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, trending


  // Fetch posts from API
  const fetchPosts = async ({ pageParam = 1 }) => {
    try {
      const response = await postApi.getPosts(pageParam, 10, filter);
      return {
        posts: response.posts || [],
        nextCursor: response.hasMore ? pageParam + 1 : undefined,
        hasMore: response.hasMore || false
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      return {
        posts: [],
        nextCursor: undefined,
        hasMore: false
      };
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useInfiniteQuery(
    ['posts', filter, sortBy],
    fetchPosts,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const posts = data?.pages.flatMap(page => page.posts) || [];

  const handleLike = useCallback(async (postId, isLiked) => {
    try {
      await postApi.toggleLike(postId);
      toast.success(isLiked ? 'Post unliked' : 'Post liked');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  }, []);

  const handleComment = useCallback(async (postId, content) => {
    try {
      if (content && content.trim()) {
        await postApi.addComment(postId, content.trim());
        toast.success('Comment added successfully');
        refetch(); // Refresh the feed to show updated comment count
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  }, [refetch]);

  const handleShare = useCallback(async (post) => {
    try {
      await postApi.sharePost(post.id);
      toast.success('Post shared');
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    }
  }, []);

  const handleBookmark = useCallback(async (postId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await postApi.removeBookmark(postId);
        toast.success('Removed from bookmarks');
      } else {
        await postApi.bookmarkPost(postId);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }, []);

  const handleReport = useCallback(async (postId) => {
    try {
      await postApi.reportPost(postId, 'Inappropriate content');
      toast.success('Post reported');
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Failed to report post');
    }
  }, []);

  const handleDelete = useCallback(async (postId) => {
    try {
      await postApi.deletePost(postId);
      toast.success('Post deleted successfully');
      refetch(); // Refresh the feed
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  }, [refetch]);

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Feed Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Feed</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isRefetching}
                className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
              >
                <RefreshCw className={`h-5 w-5 ${isRefetching ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleCreatePost}
                className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Feed Filters */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilter('following')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                filter === 'following'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                filter === 'trending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-1" />
              Trending
            </button>
          </div>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card-modern p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="h-48 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-8 text-slate-500">
                <p>You've reached the end of the feed!</p>
                <p className="text-sm">Check back later for more posts.</p>
              </div>
            }
            refreshFunction={handleRefresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <div className="text-center py-4 text-slate-500">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Pull down to refresh</p>
              </div>
            }
            releaseToRefreshContent={
              <div className="text-center py-4 text-slate-500">
                <RefreshCw className="h-6 w-6 mx-auto mb-2" />
                <p>Release to refresh</p>
              </div>
            }
          >
            <div className="space-y-6">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id || post._id || `post-${index}`}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                  onReport={handleReport}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <CreatePostModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onPostCreated={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
