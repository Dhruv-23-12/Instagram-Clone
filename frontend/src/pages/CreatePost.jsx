import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postApi } from '../services/postApi.js';
import toast from 'react-hot-toast';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const caption = watch('caption');

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

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const imageUrl = await convertToBase64(selectedImage);
      
      const postData = {
        caption: data.caption || '',
        imageUrl: imageUrl
      };

      await postApi.createPost(postData);
      toast.success('Post created successfully!');
      navigate('/feed');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create Post</h1>
        <p className="text-neutral-600 mt-2">Share something with the PPSU community</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Image *
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutral-900 mb-2">
                    Click to upload an image
                  </p>
                  <p className="text-sm text-neutral-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-neutral-50 transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-600" />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-neutral-700 mb-2">
              Caption
            </label>
            <textarea
              {...register('caption', { maxLength: 500 })}
              id="caption"
              rows={4}
              className="input-field resize-none"
              placeholder="What's on your mind?"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.caption && (
                <p className="text-sm text-red-600">{errors.caption.message}</p>
              )}
              <p className="text-sm text-neutral-500 ml-auto">
                {caption?.length || 0}/500
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedImage || isUploading}
              className="flex-1 btn-primary"
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Create Post</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
