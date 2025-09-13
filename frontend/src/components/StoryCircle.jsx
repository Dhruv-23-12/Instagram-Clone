import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Plus } from 'lucide-react';

const StoryCircle = ({ author, stories, isOwn = false, onCreateStory }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (stories && stories.length > 0) {
      const latestStory = stories[0];
      const expiresAt = new Date(latestStory.expiresAt);
      const now = new Date();
      const diff = expiresAt - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Expired');
      }
    }
  }, [stories]);

  const hasActiveStories = stories && stories.length > 0 && timeLeft !== 'Expired';

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        {isOwn ? (
          <button
            onClick={onCreateStory}
            className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition-colors"
          >
            <Plus className="h-6 w-6 text-neutral-600" />
          </button>
        ) : (
          <Link to={`/stories/${author._id}`}>
            <div className={`w-16 h-16 rounded-full p-0.5 ${
              hasActiveStories 
                ? 'bg-gradient-to-tr from-accent-400 via-primary-500 to-accent-600' 
                : 'bg-neutral-200'
            }`}>
              <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                {author.avatarUrl ? (
                  <img 
                    src={author.avatarUrl} 
                    alt={author.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6 text-neutral-500" />
                )}
              </div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-xs font-medium text-neutral-900 truncate max-w-16">
          {isOwn ? 'Your Story' : author.name}
        </p>
        {hasActiveStories && (
          <p className="text-xs text-neutral-500">{timeLeft}</p>
        )}
      </div>
    </div>
  );
};

export default StoryCircle;
