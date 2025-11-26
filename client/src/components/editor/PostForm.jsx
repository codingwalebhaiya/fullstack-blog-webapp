// components/posts/PostForm.jsx
import React, { useState } from 'react';
import TiptapEditor from "../editor/TiptapEditor"
import ImageUpload from "../../components/editor/ImageUpload"
import Button from "../../components/ui/Button"

const PostForm = ({ onSubmit, submitButtonText = "Create Post", isLoading = false, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    postImageUrl: initialData?.postImageUrl || '',
    postImagePublicId: initialData?.postImagePublicId || ''
  });
  const [errors, setErrors] = useState({});

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.title.trim()) {
  //     newErrors.title = 'Title is required';
  //   } else if (formData.title.length < 5) {
  //     newErrors.title = 'Title must be at least 5 characters long';
  //   }

  //   if (!formData.content.trim() || formData.content === '<p></p>') {
  //     newErrors.content = 'Content is required';
  //   }

  //   if (!formData.postImageUrl) {
  //     newErrors.postImageUrl = 'Featured image is required';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // components/posts/PostForm.jsx (Updated validation)
const validateForm = () => {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  } else if (formData.title.length < 5) {
    newErrors.title = 'Title must be at least 5 characters long';
  } else if (formData.title.length > 200) {
    newErrors.title = 'Title must be less than 200 characters';
  }

  // Check if content is empty or just contains empty paragraphs
  const cleanContent = formData.content.replace(/<p><\/p>/g, '').trim();
  if (!cleanContent || cleanContent === '<p></p>') {
    newErrors.content = 'Content is required';
  } else if (cleanContent.length < 50) {
    newErrors.content = 'Content should be at least 50 characters long';
  }

  if (!formData.postImageUrl) {
    newErrors.postImageUrl = 'Featured image is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({
      ...prev,
      postImageUrl: imageData.url,
      postImagePublicId: imageData.publicId
    }));
    
    if (errors.postImageUrl) {
      setErrors(prev => ({
        ...prev,
        postImageUrl: ''
      }));
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      postImageUrl: '',
      postImagePublicId: ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Post Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter a compelling title for your post..."
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image *
        </label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          currentImage={formData.postImageUrl}
          error={errors.postImageUrl}
          disabled={isLoading}
        />
        {errors.postImageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.postImageUrl}</p>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <TiptapEditor
          value={formData.content}
          onChange={(content) => handleInputChange('content', content)}
          placeholder="Write your post content here..."
          height="400px"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;