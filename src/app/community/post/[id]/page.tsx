'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Heart, MessageCircle, Share, ArrowRight } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CommunityService } from '@/lib/supabase/services';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

// Sample post data - in real app, this would come from API
/*
const samplePost = {
  id: 1,
  user: {
    name: 'Olivia Rose',
    username: '@oliviarose',
    avatar: '/api/placeholder/48/48',
  },
  content: 'My new plant is thriving! I\'ve been using a new fertilizer and it seems to be doing wonders. Any tips for keeping it healthy during the winter?',
  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=450&fit=crop&crop=center',
  likes: 23,
  comments: 5,
  shares: 2,
  timestamp: '1d ago',
  tags: ['#monstera', '#plantcare', '#wintertips'],
  isLiked: false,
  commentsData: [
    {
      id: 1,
      user: {
        name: 'Sophia Green',
        avatar: '/api/placeholder/40/40',
      },
      content: 'It looks amazing! I\'ve had great success with a humidifier during the colder months.',
      timestamp: '2d ago',
    },
    {
      id: 2,
      user: {
        name: 'Ethan Reed',
        avatar: '/api/placeholder/40/40',
      },
      content: 'Wow, what kind of plant is this? It\'s beautiful!',
      timestamp: '3d ago',
    },
  ],
};
*/

interface CommentProps {
  comment: {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
}

function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-4 group">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold text-sm">
        U
      </div>
      <div className="flex-1">
        <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700 group-hover:border-gray-600 transition-colors">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-white font-bold text-sm">User</p>
            <p className="text-gray-400 text-xs">{new Date(comment.created_at).toLocaleDateString()}</p>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  // const colors = usePlantColors();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [post, setPost] = useState<{
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
    users: {
      id: string;
      username: string;
      full_name: string;
      avatar_url?: string;
    };
  } | null>(null);
  const [comments, setComments] = useState<{
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  }[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleLike = async () => {
    if (!user || !isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isLiked) {
        // Unlike the post
        await CommunityService.unlikePost(params.id as string, user.id);
        setLikesCount(prev => prev - 1);
      } else {
        // Like the post
        await CommunityService.likePost(params.id as string, user.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user || !isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setIsPostingComment(true);
      const newCommentData = await CommunityService.createComment({
        post_id: params.id as string,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (newCommentData) {
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleShare = () => {
    console.log('Sharing post');
    // Implement sharing functionality
  };

  // Fetch post data on component mount
  React.useEffect(() => {
    const fetchPostData = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        // Fetch post details
        const postData = await CommunityService.getPostById(params.id as string);
        if (postData) {
          setPost(postData);
          setLikesCount(postData.likes_count || 0);
          
          // Fetch comments
          const commentsData = await CommunityService.getPostComments(params.id as string);
          setComments(commentsData || []);
          
          // Check if user has liked this post
          if (user) {
            const userLike = await CommunityService.hasUserLikedPost(user.id, params.id as string);
            setIsLiked(userLike);
          }
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [params.id, user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-700 px-4 md:px-10 py-4">
        <div className="flex items-center gap-4 text-white">
          <div className="w-6 h-6 text-sage">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold">Plantopia</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700">
            <Share className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
        <div className="flex flex-col w-full max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav aria-label="breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <button 
                    onClick={() => router.push('/community')}
                    className="text-gray-400 hover:text-sage transition-colors"
                  >
                    Community
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li><span className="text-white font-medium">Post</span></li>
              </ol>
            </nav>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
                <p className="text-gray-400">Loading post...</p>
              </div>
            </div>
          ) : post ? (
            /* Post Card */
            <Card className="bg-gray-800 rounded-2xl overflow-hidden border-gray-700">
              {/* User Info Header */}
              <div className="p-6 flex items-center gap-4 border-b border-gray-700">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold">
                  {post.users?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white font-bold">{post.users?.full_name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-400">Posted {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

            {/* Post Content */}
            <div className="p-6">
              <p className="text-white text-base leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Post Image */}
              {post.image_url && (
                <div className="mb-6">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative">
                    <Image
                      src={post.image_url}
                      alt="Post image"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-around border-y border-gray-700">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition-colors w-1/3 justify-center",
                  isLiked ? "text-sage" : "text-gray-400 hover:text-sage"
                )}
              >
                <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                <span className="text-sm font-bold">{likesCount} Likes</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-700"></div>
              
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-sage hover:bg-gray-700 transition-colors w-1/3 justify-center"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm font-bold">{comments.length} Comments</span>
              </Button>

              <div className="w-px h-6 bg-gray-700"></div>

              <Button
                variant="ghost"
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-sage hover:bg-gray-700 transition-colors w-1/3 justify-center"
              >
                <Share className="h-6 w-6" />
                <span className="text-sm font-bold">0 Shares</span>
              </Button>
            </div>

            {/* Comments Section */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Comments ({comments.length})</h3>
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>

            {/* Add Comment */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                      maxLength={500}
                      className="w-full bg-gray-800 border border-gray-600 rounded-2xl min-h-[48px] pl-4 pr-16 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-sage focus:border-sage transition-all resize-none"
                      placeholder="Add a comment..."
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {newComment.trim() && (
                        <Button
                          onClick={handleAddComment}
                          size="sm"
                          className="h-8 w-8 rounded-full bg-sage text-white hover:bg-sage/90 hover:scale-105 transition-all shadow-lg"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {newComment.trim() && (
                    <div className="flex items-center justify-between mt-2 px-1">
                      <span className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</span>
                      <span className="text-xs text-gray-500">{newComment.length}/500</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Post not found</p>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
