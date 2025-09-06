'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Edit3, ImagePlus } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PlantTagInput from '@/components/ui/plant-tag-input';
import { cn } from '@/lib/utils';
import { Plant } from '@/lib/data/plants';
import { CommunityService } from '@/lib/supabase/services';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

type VisibilityType = 'public' | 'friends' | 'private';

interface VisibilityOption {
  value: VisibilityType;
  label: string;
  description: string;
}

const visibilityOptions: VisibilityOption[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone on Plantopia'
  },
  {
    value: 'friends',
    label: 'Friends',
    description: 'Only people you follow'
  },
  {
    value: 'private',
    label: 'Only me',
    description: 'Only you can see this post'
  }
];

export default function CreatePostPage() {
  const router = useRouter();
  // const colors = usePlantColors();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [caption, setCaption] = useState('');
  const [taggedPlants, setTaggedPlants] = useState<Plant[]>([]);
  const [visibility, setVisibility] = useState<VisibilityType>('public');
  const [selectedImage, setSelectedImage] = useState<string>('https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&h=450&fit=crop&crop=center');
  const [isPosting, setIsPosting] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handlePost = async () => {
    if (!caption.trim() && !selectedImage) return;
    if (!user || !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsPosting(true);
    try {
      // Create post in Supabase
      const newPost = await CommunityService.createPost({
        user_id: user.id,
        content: caption,
        image_url: selectedImage !== 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&h=450&fit=crop&crop=center' ? selectedImage : null,
      });

      if (newPost) {
        console.log('Post created successfully:', newPost);
        router.push('/community');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const isPostDisabled = !caption.trim() && !selectedImage;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-sage">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">Plantopia</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          <X className="h-6 w-6" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create a Post</h1>
          
          {/* Image Upload Area */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-800">
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt="Post image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <button className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/75">
                  <Edit3 className="h-5 w-5" />
                  <span className="sr-only">Edit Image</span>
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <ImagePlus className="h-12 w-12 text-gray-400" />
                <p className="text-gray-400">Add a photo of your plant</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-lg font-bold text-white" htmlFor="caption">
                Caption
              </label>
              <span className="text-sm text-gray-400">
                {caption.length}/500
              </span>
            </div>
            <Textarea
              id="caption"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
              className="resize-none rounded-xl border-gray-600 bg-gray-800 p-4 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-gray-900"
              placeholder="Share something about your plant..."
            />
          </div>

          {/* Tag Plants */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Tag Your Plants</h3>
            <PlantTagInput
              selectedPlants={taggedPlants}
              onPlantsChange={setTaggedPlants}
              placeholder="Search for plants"
            />
          </div>

          {/* Privacy Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Who can see this post?</h3>
            <fieldset className="space-y-3">
              <legend className="sr-only">Post visibility</legend>
              {visibilityOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border border-gray-600 p-4 transition-colors hover:border-sage",
                    visibility === option.value && "border-sage bg-gray-800"
                  )}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={visibility === option.value}
                    onChange={(e) => setVisibility(e.target.value as VisibilityType)}
                    className="h-5 w-5 appearance-none rounded-full border-2 border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-gray-900 checked:border-sage checked:bg-sage"
                    style={{
                      backgroundImage: visibility === option.value 
                        ? `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27%23ffffff%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%274%27/%3e%3c/svg%3e')`
                        : 'none'
                    }}
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </label>
              ))}
            </fieldset>
          </div>

          {/* Post Button */}
          <div className="pt-4">
            <Button
              onClick={handlePost}
              disabled={isPostDisabled || isPosting}
              className={cn(
                "w-full py-3.5 text-base font-bold rounded-full transition-transform active:scale-100",
                isPostDisabled || isPosting
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                  : "bg-sage hover:bg-sage/90 text-white hover:scale-105"
              )}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
