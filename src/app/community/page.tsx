'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MessageCircle, Heart, Flag, MoreHorizontal, Plus } from 'lucide-react';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { CommunityService } from '@/lib/supabase/services';
import type { PostWithUser } from '@/types/api';
// import { usePlantColors } from '@/lib/theme';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PlantopiaHeader from '@/components/ui/plantopia-header';
import PlantFilterDropdown from '@/components/ui/plant-filter-dropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// import { filterPlantsByCategory } from '@/lib/data/plants';

// Sample post data
const samplePosts = [
  {
    id: 1,
    user: {
      name: 'Sophia Green',
      username: '@sophiagreen',
      avatar: '/api/placeholder/48/48',
    },
    content: 'My beautiful monstera is thriving! So proud of this new leaf. 🌱 #monsteramonday #plantlove',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=500&h=500&fit=crop&crop=center',
    likes: 1200,
    comments: 34,
    timestamp: '2h ago',
  },
  {
    id: 2,
    user: {
      name: 'Ethan Bloom',
      username: '@ethanbloom',
      avatar: '/api/placeholder/48/48',
    },
    content: 'Just repotted my fiddle leaf fig. Wish me luck! 🤞 #fiddleleaffig #houseplants',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&h=500&fit=crop&crop=center',
    likes: 872,
    comments: 21,
    timestamp: '4h ago',
  },
];

// Sample user data for followers/following
const sampleUsers = [
  {
    id: 1,
    name: 'Sophia Green',
    username: '@sophiagreen',
    avatar: '/api/placeholder/48/48',
    isFollowing: false,
  },
  {
    id: 2,
    name: 'Ethan Bloom',
    username: '@ethanbloom',
    avatar: '/api/placeholder/48/48',
    isFollowing: true,
  },
  {
    id: 3,
    name: 'Liam Gardener',
    username: '@liamgardener',
    avatar: '/api/placeholder/48/48',
    isFollowing: true,
  },
  {
    id: 4,
    name: 'Chloe Evergreen',
    username: '@chloeevergreen',
    avatar: '/api/placeholder/48/48',
    isFollowing: false,
  },
  {
    id: 5,
    name: 'Olivia Rose',
    username: '@oliviarose',
    avatar: '/api/placeholder/48/48',
    isFollowing: false,
  },
];

type TabType = 'posts' | 'followers' | 'following';

interface PostCardProps {
  post: typeof samplePosts[0];
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onReport: (postId: number) => void;
}

interface UserListItemProps {
  user: typeof sampleUsers[0];
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
}

function PostCard({ post, onLike, onComment, onReport }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handlePostClick = () => {
    router.push(`/community/post/${post.id}`);
  };

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-sm">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold">
              {post.user.name.charAt(0)}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">{post.user.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post Content */}
        <div 
          onClick={handlePostClick}
          className="cursor-pointer"
        >
          <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

          {/* Post Image */}
          <div className="aspect-square w-full overflow-hidden rounded-xl mb-4 relative">
            <Image 
              alt="Plant post image" 
              className="object-cover transition-transform hover:scale-105" 
              src={post.image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 hover:bg-transparent",
                isLiked ? "text-sage" : "text-muted-foreground hover:text-sage"
              )}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePostClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReport(post.id)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-transparent"
          >
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UserListItem({ user, onFollow, onUnfollow }: UserListItemProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      onUnfollow(user.id);
    } else {
      setIsFollowing(true);
      onFollow(user.id);
    }
  };

  return (
    <li className="flex items-center justify-between gap-6 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold text-sm">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </div>
      <Button
        onClick={handleFollowToggle}
        variant={isFollowing ? "secondary" : "default"}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          isFollowing 
            ? "bg-secondary text-muted-foreground hover:bg-muted" 
            : "bg-sage text-white hover:bg-sage/90"
        )}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </li>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Plants');
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load community data from Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCommunityData();
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const loadCommunityData = async () => {
    try {
      setIsLoading(true);
      const postsData = await CommunityService.getPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading community data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (postId: number) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: number) => {
    console.log('Comment on post:', postId);
  };

  const handleReport = (postId: number) => {
    console.log('Report post:', postId);
  };

  const handleFollow = (userId: number) => {
    console.log('Followed user:', userId);
  };

  const handleUnfollow = (userId: number) => {
    console.log('Unfollowed user:', userId);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Here you could filter posts based on the selected category
    console.log('Filter changed to:', category);
  };

  const tabs = [
    { id: 'posts' as TabType, label: 'Posts' },
    { id: 'followers' as TabType, label: 'Followers' },
    { id: 'following' as TabType, label: 'Following' },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <PlantopiaHeader currentPage="community" />

      {/* Main Content */}
      <main className="flex flex-1 justify-center bg-secondary/30 py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
        <div className="w-full max-w-4xl">
          {/* Search Bar */}
          <div className="pb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                id="search"
                name="search"
                placeholder="Search users and posts..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pb-6">
            <div className="border-b border-border">
              <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors",
                      activeTab === tab.id
                        ? "border-sage text-sage font-semibold"
                        : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Header - Only for Posts tab */}
          {activeTab === 'posts' && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-foreground">Community Hub</h2>
              <PlantFilterDropdown
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          )}

          {/* Posts Feed */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 gap-8 pb-4 md:pb-0">
              {samplePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onReport={handleReport}
                />
              ))}
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <div className="grid grid-cols-1 gap-8 pb-4 md:pb-0">
              <Card className="overflow-hidden border border-border bg-card shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">Followers</h3>
                </div>
                <ul className="divide-y divide-border" role="list">
                  {sampleUsers.map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* Following Tab */}
          {activeTab === 'following' && (
            <div className="grid grid-cols-1 gap-8 pb-4 md:pb-0">
              <Card className="overflow-hidden border border-border bg-card shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">Following</h3>
                </div>
                <ul className="divide-y divide-border" role="list">
                  {sampleUsers
                    .filter(user => user.isFollowing)
                    .map((user) => (
                      <UserListItem
                        key={user.id}
                        user={user}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                      />
                    ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/90 backdrop-blur-sm shadow-lg">
        <div className="flex h-16 items-center justify-around">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-sage">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-sage">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M232,64H208V56a16,16,0,0,0-16-16H64A16,16,0,0,0,48,56v8H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-28.49,64.64-63.51,64.9H128a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z" />
            </svg>
            <span className="text-xs font-semibold">Leaderboard</span>
          </Button>

          <Button 
            size="icon"
            onClick={() => router.push('/community/create')}
            className="h-14 w-14 -translate-y-4 rounded-full bg-sage text-white shadow-lg hover:scale-105 hover:bg-sage/90 transition-all"
          >
            <Plus className="h-8 w-8" />
          </Button>

          <Button variant="ghost" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-sage">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z" />
            </svg>
            <span className="text-xs font-semibold">Shop</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-sage"
          >
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </svg>
            <span className="text-xs font-semibold">Profile</span>
          </Button>
        </div>
      </footer>

      {/* Desktop Bottom Navigation */}
      <div className="hidden md:block">
        <BottomNavigation />
      </div>
    </div>
  );
}
