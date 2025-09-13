import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Flag, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(true);

  // Mock post data - replace with actual API call
  const mockPost = {
    id: postId,
    content: 'Excited to announce the upcoming PPSU Tech Symposium 2024! This year we have amazing speakers from top tech companies. Don\'t miss out on this incredible learning opportunity! 🚀 #PPSUFest2024 #Technology #Innovation',
    author: {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      role: 'Professor',
      department: 'Computer Science',
      isVerified: true
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 8,
    isLiked: false,
    isBookmarked: false,
    location: 'PPSU Campus',
    hashtags: ['#PPSUFest2024', '#Technology', '#Innovation'],
    mentions: [],
    media: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop'
    }],
    comments: [
      {
        id: '1',
        content: 'Looking forward to it! This is going to be an amazing event.',
        author: {
          id: '2',
          name: 'Priya Sharma',
          role: 'Student',
          department: 'Information Technology'
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likesCount: 5,
        isLiked: false
      },
      {
        id: '2',
        content: 'Count me in! I\'ve been waiting for this symposium.',
        author: {
          id: '3',
          name: 'Amit Patel',
          role: 'Student',
          department: 'Computer Science'
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        likesCount: 3,
        isLiked: true
      }
    ]
  };

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPost(mockPost);
      setIsLiked(mockPost.isLiked);
      setIsBookmarked(mockPost.isBookmarked);
      setIsLoading(false);
    };

    loadPost();
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like API call
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark API call
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share post:', post.id);
  };

  const handleCommentLike = (commentId) => {
    // TODO: Implement comment like API call
    console.log('Like comment:', commentId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Post not found</h2>
          <p className="text-slate-600 mb-4">The post you're looking for doesn't exist.</p>
          <Link to="/feed" className="btn-primary">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/feed" 
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Feed</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Post */}
          <div className="lg:col-span-2">
            <div className="card-modern">
              {/* Post Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <Link to={`/profile/${post.author.id}`} className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Link to={`/profile/${post.author.id}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors">
                        {post.author.name}
                      </Link>
                      {post.author.isVerified && (
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {post.author.role && (
                        <span className="text-sm text-slate-500">• {post.author.role}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <span>{formatDistanceToNow(post.createdAt)} ago</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span>{post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-slate-900 leading-relaxed whitespace-pre-wrap mb-4">
                  {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Media */}
                {post.media.length > 0 && (
                  <div className="mb-6">
                    {post.media[0].type === 'image' ? (
                      <img 
                        src={post.media[0].url} 
                        alt="Post content" 
                        className="w-full h-auto max-h-96 object-cover rounded-xl"
                      />
                    ) : (
                      <video 
                        src={post.media[0].url} 
                        controls 
                        className="w-full h-auto max-h-96 object-cover rounded-xl"
                      />
                    )}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    {post.likesCount > 0 && (
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-accent-500 fill-current" />
                        <span>{post.likesCount}</span>
                      </span>
                    )}
                    {post.commentsCount > 0 && (
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentsCount}</span>
                      </span>
                    )}
                    {post.sharesCount > 0 && (
                      <span className="flex items-center space-x-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.sharesCount}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isLiked 
                        ? 'text-accent-600 bg-accent-50' 
                        : 'text-slate-600 hover:text-accent-600 hover:bg-accent-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">Like</span>
                  </button>

                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">Comment</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-success-600 hover:bg-success-50 transition-all duration-200"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="font-medium">Share</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isBookmarked 
                        ? 'text-warning-600 bg-warning-50' 
                        : 'text-slate-600 hover:text-warning-600 hover:bg-warning-50'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="font-medium">Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-6 space-y-4">
                {/* Comment Input */}
                <div className="card-modern p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                      U
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="card-modern p-6">
                      <div className="flex items-start space-x-3">
                        <Link to={`/profile/${comment.author.id}`} className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center text-white font-bold">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link to={`/profile/${comment.author.id}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors">
                              {comment.author.name}
                            </Link>
                            <span className="text-sm text-slate-500">•</span>
                            <span className="text-sm text-slate-500">{formatDistanceToNow(comment.createdAt)} ago</span>
                          </div>
                          <p className="text-slate-700 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className="flex items-center space-x-1 text-sm text-slate-500 hover:text-accent-600 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span>{comment.likesCount}</span>
                            </button>
                            <button className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">About the Author</h3>
              <div className="flex items-center space-x-3 mb-4">
                <Link to={`/profile/${post.author.id}`} className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Link>
                <div>
                  <Link to={`/profile/${post.author.id}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors">
                    {post.author.name}
                  </Link>
                  <p className="text-sm text-slate-500">{post.author.role} • {post.author.department}</p>
                </div>
              </div>
              <Link 
                to={`/profile/${post.author.id}`} 
                className="w-full btn-outline text-center"
              >
                View Profile
              </Link>
            </div>

            {/* Related Posts */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Posts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-700 mb-2">More posts from {post.author.name}</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-700 mb-2">Similar topics in your feed</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;