import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { storyApi } from '../services/storyApi.js';
import toast from 'react-hot-toast';
import StoryViewer from '../components/StoryViewer.jsx';
import { ArrowLeft, User } from 'lucide-react';

const Stories = () => {
  const { userId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);
        const response = await storyApi.getUserStories(userId);
        setStories(response.stories);
      } catch (error) {
        toast.error('Failed to load stories');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadStories();
    }
  }, [userId]);

  const handleStoryClick = (index) => {
    setCurrentStoryIndex(index);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No stories yet</h3>
          <p className="text-neutral-600">
            This user hasn't shared any stories recently.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            {stories[0]?.author?.avatarUrl ? (
              <img 
                src={stories[0].author.avatarUrl} 
                alt={stories[0].author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-neutral-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {stories[0].author.name}'s Stories
            </h1>
            <p className="text-neutral-600">
              {stories.length} active stor{stories.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {stories.map((story, index) => (
          <div
            key={story._id}
            onClick={() => handleStoryClick(index)}
            className="group cursor-pointer"
          >
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
              {story.type === 'image' && story.imageUrl ? (
                <img
                  src={story.imageUrl}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              ) : story.type === 'text' ? (
                <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center p-4">
                  <p className="text-white text-sm text-center line-clamp-3">
                    {story.content}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-neutral-500 text-sm">Video</span>
                </div>
              )}
            </div>
            
            {/* Story Info */}
            <div className="mt-2 text-center">
              <p className="text-xs text-neutral-500">
                {new Date(story.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {showViewer && (
        <StoryViewer
          stories={stories}
          currentIndex={currentStoryIndex}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default Stories;
