import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Bookmark, 
  Flag,
  User,
  Calendar,
  MapPin,
  Hash
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onLike, onComment, onShare, onBookmark, onReport }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id, !isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id, !isBookmarked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post);
  };

  const handleReport = () => {
    onReport?.(post.id);
    setShowMore(false);
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    if (post.media.length === 1) {
      const media = post.media[0];
      return (
        <div className="mt-4 rounded-xl overflow-hidden">
          {media.type === 'image' ? (
            <img 
              src={media.url} 
              alt="Post content" 
              className="w-full h-auto max-h-96 object-cover"
            />
          ) : (
            <video 
              src={media.url} 
              controls 
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>
      );
    }

    // Multiple media (carousel)
    return (
      <div className="mt-4 rounded-xl overflow-hidden">
        <div className="relative">
          <img 
            src={post.media[0].url} 
            alt="Post content" 
            className="w-full h-auto max-h-96 object-cover"
          />
          {post.media.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm font-medium">
              +{post.media.length - 1} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHashtags = () => {
    if (!post.hashtags || post.hashtags.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-2">
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
    );
  };

  const renderMentions = () => {
    if (!post.mentions || post.mentions.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {post.mentions.map((mention, index) => (
          <Link
            key={index}
            to={`/profile/${mention.id}`}
            className="text-accent-600 hover:text-accent-700 font-medium text-sm"
          >
            @{mention.username}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <article className="card-modern hover:shadow-medium transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
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
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          
          {showMore && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-large border border-slate-200 py-2 z-10">
              <button
                onClick={handleBookmark}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Bookmark className="h-4 w-4" />
                <span>{isBookmarked ? 'Remove from Bookmarks' : 'Save Post'}</span>
              </button>
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Flag className="h-4 w-4" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        {renderHashtags()}
        {renderMentions()}
      </div>

      {/* Post Media */}
      {renderMedia()}

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
        
        {post.isPinned && (
          <div className="flex items-center space-x-1 text-primary-600 text-sm font-medium">
            <span>📌</span>
            <span>Pinned</span>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
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
          onClick={handleComment}
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

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            {/* Comment Input */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Sample Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.slice(0, 3).map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-xl px-4 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-slate-900 text-sm">{comment.author.name}</span>
                          <span className="text-xs text-slate-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;