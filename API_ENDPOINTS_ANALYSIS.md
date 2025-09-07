# Plantopia PWA - API Endpoints & Schema Analysis

## Overview

This document provides a comprehensive analysis of all API endpoints, TypeScript interfaces, and Supabase schema for the Plantopia PWA application. The application uses **Supabase** as the backend with client-side service classes instead of traditional REST API endpoints.

## Architecture

- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Client**: TypeScript service classes that interact with Supabase
- **Schema**: Row Level Security (RLS) enabled for all tables
- **AI Integration**: Prepared for Gemini 2.5 Flash Lite (not yet implemented)

## API Endpoints (Supabase Service Layer)

### 1. User Service (`UserService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getCurrentUser()` | Get current authenticated user | - | `User \| null` |
| `getUserById(userId)` | Get user by ID | `userId: string` | `User \| null` |
| `getUserByUsername(username)` | Get user by username | `username: string` | `User \| null` |
| `createUser(userData)` | Create new user profile | `userData: Omit<UserInsert, 'id'>` | `User \| null` |
| `createUserWithId(userData)` | Create user with specific ID | `userData: UserInsert` | `User \| null` |
| `updateUser(userId, updates)` | Update user profile | `userId: string, updates: UserUpdate` | `User \| null` |
| `updateOnlineStatus(userId, isOnline)` | Update user's online status | `userId: string, isOnline: boolean` | `void` |
| `getFollowers(userId)` | Get user's followers | `userId: string` | `User[]` |
| `getFollowing(userId)` | Get users that user follows | `userId: string` | `User[]` |
| `followUser(followerId, followingId)` | Follow a user | `followerId: string, followingId: string` | `boolean` |
| `unfollowUser(followerId, followingId)` | Unfollow a user | `followerId: string, followingId: string` | `boolean` |
| `isFollowing(followerId, followingId)` | Check if user is following another | `followerId: string, followingId: string` | `boolean` |
| `searchUsers(query, currentUserId)` | Search users by username/name | `query: string, currentUserId: string` | `User[]` |

### 2. Plant Service (`PlantService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getUserPlants(userId, includeArchived)` | Get all plants for user | `userId: string, includeArchived?: boolean` | `Plant[]` |
| `getPlantById(plantId)` | Get plant by ID | `plantId: string` | `Plant \| null` |
| `createPlant(plantData)` | Create new plant | `plantData: Omit<PlantInsert, 'id'>` | `Plant \| null` |
| `updatePlant(plantId, updates)` | Update plant | `plantId: string, updates: PlantUpdate` | `Plant \| null` |
| `togglePlantArchive(plantId, isArchived)` | Archive/unarchive plant | `plantId: string, isArchived: boolean` | `boolean` |
| `deletePlant(plantId)` | Delete plant | `plantId: string` | `boolean` |
| `getPlantsByCategory(userId, category)` | Get plants by category | `userId: string, category: string` | `Plant[]` |
| `updatePlantMetrics(plantId, updates)` | Update health/moisture/sunlight | `plantId: string, updates: Pick<PlantUpdate, 'health' \| 'moisture' \| 'sunlight'>` | `boolean` |
| `waterPlant(plantId)` | Water plant action | `plantId: string` | `boolean` |
| `fertilizePlant(plantId)` | Fertilize plant action | `plantId: string` | `boolean` |
| `getPlantCareHistory(plantId)` | Get care history logs | `plantId: string` | `PlantCareLog[]` |
| `logPlantCare(plantId, userId, action, details)` | Log care action | `plantId: string, userId: string, action: string, details?: string` | `boolean` |
| `getPlantsNeedingWater(userId)` | Get plants with low moisture | `userId: string` | `Plant[]` |
| `getPlantsNeedingAttention(userId)` | Get plants with low health | `userId: string` | `Plant[]` |
| `getPlantStats(userId)` | Get plant statistics | `userId: string` | `PlantStats` |

### 3. Task Service (`TaskService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getUserTasks(userId, status?)` | Get all tasks for user | `userId: string, status?: string` | `Task[]` |
| `getTaskById(taskId)` | Get task by ID | `taskId: string` | `Task \| null` |
| `createTask(taskData)` | Create new task | `taskData: Omit<TaskInsert, 'id'>` | `Task \| null` |
| `updateTask(taskId, updates)` | Update task | `taskId: string, updates: TaskUpdate` | `Task \| null` |
| `deleteTask(taskId)` | Delete task | `taskId: string` | `boolean` |
| `completeTask(taskId)` | Mark task as completed | `taskId: string` | `boolean` |
| `startTask(taskId)` | Mark task as in progress | `taskId: string` | `boolean` |
| `getPlantTasks(plantId)` | Get tasks for specific plant | `plantId: string` | `Task[]` |
| `getOverdueTasks(userId)` | Get overdue tasks | `userId: string` | `Task[]` |
| `getTasksDueToday(userId)` | Get tasks due today | `userId: string` | `Task[]` |
| `getTasksDueThisWeek(userId)` | Get tasks due this week | `userId: string` | `Task[]` |
| `createRecurringTasks(userId, plantId)` | Create recurring tasks | `userId: string, plantId: string` | `Task[]` |
| `getTaskStats(userId)` | Get task statistics | `userId: string` | `TaskStats` |

### 4. Community Service (`CommunityService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getPosts(limit, offset)` | Get all posts with pagination | `limit?: number, offset?: number` | `PostWithUser[]` |
| `getUserPosts(userId, limit, offset)` | Get posts by specific user | `userId: string, limit?: number, offset?: number` | `PostWithUser[]` |
| `getPostById(postId)` | Get post by ID with full details | `postId: string` | `PostWithUser \| null` |
| `createPost(postData)` | Create new post | `postData: Omit<PostInsert, 'id'>` | `Post \| null` |
| `updatePost(postId, updates)` | Update post | `postId: string, updates: Partial<PostInsert>` | `Post \| null` |
| `deletePost(postId)` | Delete post | `postId: string` | `boolean` |
| `getPostComments(postId)` | Get comments for a post | `postId: string` | `CommentWithUser[]` |
| `createComment(commentData)` | Create new comment | `commentData: Omit<CommentInsert, 'id'>` | `Comment \| null` |
| `updateComment(commentId, updates)` | Update comment | `commentId: string, updates: Partial<CommentInsert>` | `Comment \| null` |
| `deleteComment(commentId)` | Delete comment | `commentId: string` | `boolean` |
| `likePost(userId, postId)` | Like a post | `userId: string, postId: string` | `boolean` |
| `unlikePost(userId, postId)` | Unlike a post | `userId: string, postId: string` | `boolean` |
| `hasUserLikedPost(userId, postId)` | Check if user liked post | `userId: string, postId: string` | `boolean` |
| `getFollowedUsersPosts(userId, limit, offset)` | Get posts from followed users | `userId: string, limit?: number, offset?: number` | `PostWithUser[]` |
| `searchPosts(query, limit)` | Search posts by content | `query: string, limit?: number` | `PostWithUser[]` |
| `getTrendingPosts(limit)` | Get trending posts | `limit?: number` | `PostWithUser[]` |
| `getPostStats(postId)` | Get post statistics | `postId: string` | `PostStats` |

### 5. Message Service (`MessageService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getConversation(userId1, userId2, limit)` | Get conversation between users | `userId1: string, userId2: string, limit?: number` | `Message[]` |
| `getRecentConversations(userId)` | Get recent conversations for user | `userId: string` | `ConversationSummary[]` |
| `sendMessage(messageData)` | Send a message | `messageData: Omit<MessageInsert, 'id'>` | `Message \| null` |
| `markMessagesAsRead(senderId, receiverId)` | Mark messages as read | `senderId: string, receiverId: string` | `boolean` |
| `getUnreadCount(userId, otherUserId)` | Get unread count for conversation | `userId: string, otherUserId: string` | `number` |
| `getTotalUnreadCount(userId)` | Get total unread messages | `userId: string` | `number` |
| `deleteMessage(messageId, userId)` | Delete a message | `messageId: string, userId: string` | `boolean` |
| `searchMessages(userId, query)` | Search messages by content | `userId: string, query: string` | `Message[]` |
| `getMessageStats(userId)` | Get message statistics | `userId: string` | `MessageStats` |

### 6. Achievement Service (`AchievementService`)

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getUserAchievements(userId)` | Get all achievements for user | `userId: string` | `Achievement[]` |
| `getAchievementById(achievementId)` | Get achievement by ID | `achievementId: string` | `Achievement \| null` |
| `createAchievement(achievementData)` | Create new achievement | `achievementData: Omit<AchievementInsert, 'id'>` | `Achievement \| null` |
| `updateAchievement(achievementId, updates)` | Update achievement | `achievementId: string, updates: AchievementUpdate` | `Achievement \| null` |
| `completeAchievement(achievementId)` | Mark achievement as completed | `achievementId: string` | `boolean` |
| `getCompletedAchievements(userId)` | Get completed achievements | `userId: string` | `Achievement[]` |
| `getPendingAchievements(userId)` | Get pending achievements | `userId: string` | `Achievement[]` |
| `checkAndAwardAchievements(userId)` | Check and award achievements | `userId: string` | `Achievement[]` |
| `getAchievementStats(userId)` | Get achievement statistics | `userId: string` | `AchievementStats` |
| `getRecentlyCompletedAchievements(userId, limit)` | Get recently completed | `userId: string, limit?: number` | `Achievement[]` |

### 7. AI Service (`AIService`) - **NEW**

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getUserAIInteractions(userId, limit)` | Get all AI interactions for user | `userId: string, limit?: number` | `AIInteraction[]` |
| `getAIInteractionsByType(userId, type, limit)` | Get AI interactions by type | `userId: string, interactionType: string, limit?: number` | `AIInteraction[]` |
| `createAIInteraction(interactionData)` | Create new AI interaction | `interactionData: Omit<AIInteractionInsert, 'id'>` | `AIInteraction \| null` |
| `updateAIInteraction(interactionId, updates)` | Update AI interaction | `interactionId: string, updates: AIInteractionUpdate` | `AIInteraction \| null` |
| `deleteAIInteraction(interactionId)` | Delete AI interaction | `interactionId: string` | `boolean` |
| `identifyPlant(userId, request)` | **[FUTURE]** Plant identification | `userId: string, request: PlantIdentificationRequest` | `PlantIdentificationResponse \| null` |
| `getCareAdvice(userId, request)` | **[FUTURE]** Get plant care advice | `userId: string, request: CareAdviceRequest` | `CareAdviceResponse \| null` |
| `detectDisease(userId, request)` | **[FUTURE]** Detect plant diseases | `userId: string, request: DiseaseDetectionRequest` | `DiseaseDetectionResponse \| null` |
| `generalChat(userId, request)` | **[FUTURE]** General chat with AI | `userId: string, request: GeneralChatRequest` | `GeneralChatResponse \| null` |
| `getAIStats(userId)` | Get AI interaction statistics | `userId: string` | `AIStats` |
| `searchAIInteractions(userId, query, limit)` | Search AI interactions | `userId: string, query: string, limit?: number` | `AIInteraction[]` |
| `getPlantAIInteractions(plantId)` | Get AI interactions for plant | `plantId: string` | `AIInteraction[]` |

## Database Schema

### Tables

1. **users** - User profiles and authentication data
2. **plants** - User's plant collection
3. **tasks** - Plant care tasks and reminders
4. **posts** - Community posts and content
5. **comments** - Comments on posts
6. **likes** - Post likes/reactions
7. **followers** - User following relationships
8. **messages** - Direct messages between users
9. **achievements** - User achievements and gamification
10. **plant_care_logs** - History of plant care actions
11. **ai_interactions** - **NEW** - AI interaction history for Gemini integration

### Enums

```sql
-- Task related enums
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_type AS ENUM ('watering', 'fertilizing', 'pruning', 'repotting', 'pest_control', 'other');

-- Plant categories
CREATE TYPE plant_category AS ENUM ('indoor', 'outdoor', 'succulent', 'herb', 'flower', 'vegetable', 'tree', 'other');

-- AI interaction types (NEW)
CREATE TYPE ai_interaction_type AS ENUM ('plant_identification', 'care_advice', 'disease_diagnosis', 'general_chat');
```

## Schema Fixes Applied

### Issues Found and Fixed:

1. **Task Type Enum Mismatch** ✅
   - **Before**: Missing `'pest_control'` in schema
   - **After**: Added `'pest_control'` to `task_type` enum

2. **Plant Category Consistency** ✅
   - **Before**: Inconsistency between schema files (plural vs singular)
   - **After**: Standardized to singular forms (`'herb'`, `'flower'`, etc.)

3. **Missing Updated_at Trigger** ✅
   - **Before**: Messages table missing `updated_at` trigger
   - **After**: Added `updated_at` column and trigger for messages table

4. **AI Integration Preparation** ✅
   - **Added**: New `ai_interactions` table for future Gemini 2.5 Flash Lite integration
   - **Added**: AI-related TypeScript interfaces and service class
   - **Added**: Proper indexing and RLS policies for AI data

## TypeScript Interfaces

All interfaces are defined in `/src/types/api.ts` and include:

- **Base Types**: `User`, `Plant`, `Task`, `Post`, `Comment`, `Like`, `Follower`, `Message`, `Achievement`, `PlantCareLog`
- **Insert Types**: For creating new records (optional fields)
- **Update Types**: For updating existing records (all optional fields)
- **Extended Types**: With relations (e.g., `PostWithUser`, `CommentWithUser`)
- **Stats Types**: For dashboard statistics
- **Form Types**: For UI form validation
- **Filter Types**: For search and filtering
- **AI Types**: **NEW** - For Gemini 2.5 Flash Lite integration

## AI Integration (Future)

The schema and interfaces are now prepared for Gemini 2.5 Flash Lite integration with:

### AI Interaction Types:
- **Plant Identification**: Upload image to identify plant species
- **Care Advice**: Get personalized plant care recommendations
- **Disease Diagnosis**: Detect plant diseases from images/symptoms
- **General Chat**: Natural language conversations about plant care

### AI Features Ready for Implementation:
- Confidence scoring for AI responses
- Image upload support for visual analysis
- Metadata storage for complex AI responses
- User interaction history tracking
- Search and filtering of AI conversations

## Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** required for all write operations
- **User isolation** - users can only access their own data
- **Public read access** for community features (posts, comments, likes)
- **Secure messaging** - users can only see conversations they're part of

## Performance Optimizations

- **Indexes** on all frequently queried columns
- **Triggers** for automatic timestamp updates
- **Materialized views** for complex statistics (user_plant_stats, user_task_stats)
- **Pagination** support in all list endpoints
- **Efficient queries** with proper joins and filtering

## Files Updated/Created

1. ✅ **Updated**: `/src/types/api.ts` - Added AI interfaces and fixed enum types
2. ✅ **Created**: `/src/lib/supabase/services/ai.ts` - New AI service class
3. ✅ **Updated**: `/src/lib/supabase/services/index.ts` - Export AI service
4. ✅ **Created**: `/supabase-schema-updated.sql` - Fixed and enhanced schema
5. ✅ **Created**: `/API_ENDPOINTS_ANALYSIS.md` - This documentation

## Next Steps for AI Integration

1. **Set up Gemini 2.5 Flash Lite API credentials**
2. **Implement actual AI API calls** in `AIService` methods
3. **Add image upload functionality** for plant identification
4. **Create AI chat UI components**
5. **Add AI interaction history pages**
6. **Implement confidence-based response handling**

The application is now fully prepared for AI integration while maintaining all existing functionality and fixing schema inconsistencies.
