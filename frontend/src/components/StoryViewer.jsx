import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Eye, User } from 'lucide-react';
import { storyApi } from '../services/storyApi.js';
import toast from 'react-hot-toast';

const StoryViewer = ({ stories, onClose, currentIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [viewedStories, setViewedStories] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const currentStory = stories[activeIndex];
  const author = currentStory?.author;

  useEffect(() => {
    if (currentStory && !viewedStories.has(currentStory._id)) {
      viewStory(currentStory._id);
    }
  }, [currentStory]);

  const viewStory = async (storyId) => {
    try {
      await storyApi.viewStory(storyId);
      setViewedStories(prev => new Set([...prev, storyId]));
    } catch (error) {
      console.error('Failed to mark story as viewed:', error);
    }
  };

  const nextStory = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') nextStory();
    if (e.key === 'ArrowLeft') prevStory();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex]);

  if (!currentStory) return null;

  const formatTimeLeft = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black opacity-90" onClick={onClose} />
      
      {/* Story Content */}
      <div className="relative z-10 w-full max-w-md h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
              {author?.avatarUrl ? (
                <img 
                  src={author.avatarUrl} 
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-neutral-500" />
              )}
            </div>
            <div>
              <Link 
                to={`/profile/${author._id}`}
                className="font-medium text-white hover:text-accent-300 transition-colors"
              >
                {author.name}
              </Link>
              <p className="text-xs text-neutral-300">
                {formatTimeLeft(currentStory.expiresAt)}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-neutral-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div className="flex space-x-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= activeIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Story Media */}
        <div className="flex-1 relative">
          {currentStory.type === 'image' && currentStory.imageUrl && (
            <img
              src={currentStory.imageUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
          
          {currentStory.type === 'video' && currentStory.videoUrl && (
            <video
              src={currentStory.videoUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          )}

          {/* Text Overlay for text stories */}
          {currentStory.type === 'text' && (
            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center p-8">
              <p className="text-white text-lg text-center leading-relaxed">
                {currentStory.content}
              </p>
            </div>
          )}

          {/* Content overlay for image/video stories */}
          {(currentStory.type === 'image' || currentStory.type === 'video') && currentStory.content && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm">{currentStory.content}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="absolute inset-0 flex">
            <div className="flex-1" onClick={prevStory} />
            <div className="flex-1" onClick={nextStory} />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{currentStory.viewsCount} views</span>
            </div>
            
            <div className="text-sm text-neutral-300">
              {activeIndex + 1} of {stories.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
