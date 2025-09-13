import { useState, useRef } from 'react';
import { X, Image, Video, MapPin, Hash, User, Smile, Send } from 'lucide-react';
import { postApi } from '../services/postApi.js';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // Upload media files first
      const uploadedMedia = [];
      for (const mediaItem of media) {
        const uploadResponse = await postApi.uploadMedia(mediaItem.file);
        uploadedMedia.push({
          type: mediaItem.type,
          url: uploadResponse.url
        });
      }

      // Create post data
      const postData = {
        content: content.trim(),
        media: uploadedMedia,
        location: location.trim() || undefined,
        hashtags: hashtags,
        mentions: mentions
      };

      // Create the post
      await postApi.createPost(postData);
      
      toast.success('Post created successfully!');

      // Reset form
      setContent('');
      setMedia([]);
      setLocation('');
      setHashtags([]);
      setMentions([]);
      
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (id) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleHashtagInput = (e) => {
    const value = e.target.value;
    const hashtagMatches = value.match(/#\w+/g);
    if (hashtagMatches) {
      setHashtags(hashtagMatches);
    }
  };

  const handleMentionInput = (e) => {
    const value = e.target.value;
    const mentionMatches = value.match(/@\w+/g);
    if (mentionMatches) {
      setMentions(mentionMatches);
    }
  };

  const insertEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👏', '🎉', '🚀', '💯', '🔥', '❤️', '✨'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-large w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                U
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Your Name</h3>
                <p className="text-sm text-slate-500">Student • Computer Science</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  handleHashtagInput(e);
                  handleMentionInput(e);
                }}
                placeholder="What's happening at PPSU?"
                className="w-full min-h-[120px] p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-slate-400"
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>{content.length}/2000</span>
                  {hashtags.length > 0 && (
                    <span className="text-primary-600">{hashtags.length} hashtags</span>
                  )}
                  {mentions.length > 0 && (
                    <span className="text-accent-600">{mentions.length} mentions</span>
                  )}
                </div>
              </div>
            </div>

            {/* Media Preview */}
            {media.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {media.map((item) => (
                    <div key={item.id} className="relative group">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-32 object-cover rounded-xl"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(item.id)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mb-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location (optional)"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              {/* Media Actions */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Video className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={(!content.trim() && media.length === 0) || isSubmitting}
                className="btn-primary px-6 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-medium">
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-2 text-2xl hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CreatePostModal;
