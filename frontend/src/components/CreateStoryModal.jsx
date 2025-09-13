import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { storyApi } from '../services/storyApi.js';
import toast from 'react-hot-toast';
import { X, Upload, Image as ImageIcon, Video, Type, Send } from 'lucide-react';

const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [storyType, setStoryType] = useState('text');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const content = watch('content');

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    if (!data.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (storyType === 'image' && !selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await convertToBase64(selectedImage);
      }

      const storyData = {
        content: data.content,
        type: storyType,
        ...(imageUrl && { imageUrl })
      };

      await storyApi.createStory(storyData);
      toast.success('Story created successfully!');
      
      // Reset form
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setStoryType('text');
      
      onStoryCreated();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create story';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setImagePreview(null);
    setStoryType('text');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Create Story</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Story Type Selector */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setStoryType('text')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                storyType === 'text'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setStoryType('image')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                storyType === 'image'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Image</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Image Upload for Image Stories */}
          {storyType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Image *
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="story-image-upload"
                  />
                  <label htmlFor="story-image-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-neutral-900 mb-1">
                      Upload an image
                    </p>
                    <p className="text-xs text-neutral-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-neutral-50 transition-colors"
                  >
                    <X className="h-3 w-3 text-neutral-600" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
              {storyType === 'text' ? 'Your Story' : 'Caption'}
            </label>
            <textarea
              {...register('content', { 
                required: 'Content is required',
                maxLength: { value: 500, message: 'Content must be less than 500 characters' }
              })}
              id="content"
              rows={storyType === 'text' ? 6 : 3}
              className="input-field resize-none"
              placeholder={storyType === 'text' ? 'What\'s happening?' : 'Add a caption...'}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
              <p className="text-sm text-neutral-500 ml-auto">
                {content?.length || 0}/500
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Share Story</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
