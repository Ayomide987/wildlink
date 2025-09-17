import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSpecies } from '../context/SpeciesContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const SocialScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const { user } = useAuth();
  const { getRecentSightings } = useSpecies();

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = () => {
    // Mock social data
    const mockPosts = [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Sarah Wildlife',
          avatar: 'https://via.placeholder.com/50',
          level: 'Expert',
        },
        content: 'Just spotted a magnificent African Fish Eagle at Lekki Conservation Centre! The way it dove for fish was absolutely incredible. 🦅',
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
        species: 'African Fish Eagle',
        location: 'Lekki Conservation Centre, Lagos',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: 8,
        shares: 3,
        liked: false,
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'Dr. James Okoye',
          avatar: 'https://via.placeholder.com/50',
          level: 'Researcher',
        },
        content: 'Educational moment: Did you know that West African Manatees can hold their breath for up to 20 minutes? These gentle giants are critically endangered with less than 10,000 remaining in the wild.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
        species: 'West African Manatee',
        location: 'Niger Delta',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: 56,
        comments: 15,
        shares: 12,
        liked: true,
      },
      {
        id: '3',
        user: {
          id: '4',
          name: 'Conservation Team',
          avatar: 'https://via.placeholder.com/50',
          level: 'Organization',
        },
        content: 'Great news! Our community has collectively logged over 1,000 wildlife sightings this month. Every observation contributes to conservation research. Keep up the amazing work! 🌿',
        image: null,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 89,
        comments: 23,
        shares: 34,
        liked: false,
      },
    ];

    const mockCommunities = [
      {
        id: '1',
        name: 'Lagos Wildlife Watchers',
        description: 'Connect with fellow wildlife enthusiasts in Lagos',
        members: 1247,
        image: 'https://via.placeholder.com/100',
        joined: true,
      },
      {
        id: '2',
        name: 'Bird Photography Nigeria',
        description: 'Share and learn bird photography techniques',
        members: 856,
        image: 'https://via.placeholder.com/100',
        joined: false,
      },
      {
        id: '3',
        name: 'Marine Conservation West Africa',
        description: 'Protecting our coastal and marine ecosystems',
        members: 2341,
        image: 'https://via.placeholder.com/100',
        joined: true,
      },
    ];

    const mockChallenges = [
      {
        id: '1',
        title: 'Rainy Season Wildlife Challenge',
        description: 'Spot 10 different species during the rainy season',
        progress: 7,
        total: 10,
        participants: 234,
        reward: '500 points + Rainy Season Badge',
        endDate: '2025-09-30',
      },
      {
        id: '2',
        title: 'Urban Wildlife Explorer',
        description: 'Find wildlife thriving in urban environments',
        progress: 3,
        total: 5,
        participants: 156,
        reward: '300 points + Urban Explorer Badge',
        endDate: '2025-08-31',
      },
    ];

    setPosts(mockPosts);
    setCommunities(mockCommunities);
    setChallenges(mockChallenges);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadSocialData();
    setRefreshing(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPostText.trim()) {
      const newPost = {
        id: Date.now().toString(),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          level: user.level,
        },
        content: newPostText,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      };
      
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setShowNewPost(false);
    }
  };

  const PostCard = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <View style={styles.postMeta}>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>{post.user.level}</Text>
            </View>
            <Text style={styles.postTime}>
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.postMenu}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
      )}

      {post.species && (
        <View style={styles.speciesTag}>
          <Ionicons name="leaf" size={16} color={theme.colors.primary} />
          <Text style={styles.speciesTagText}>{post.species}</Text>
          {post.location && (
            <>
              <Ionicons name="location" size={14} color={theme.colors.textSecondary} style={styles.locationIcon} />
              <Text style={styles.locationText}>{post.location}</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={20}
            color={post.liked ? theme.colors.notification : theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, post.liked && { color: theme.colors.notification }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ChallengeCard = ({ challenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <View style={styles.challengeProgress}>
          <Text style={styles.progressText}>{challenge.progress}/{challenge.total}</Text>
        </View>
      </View>
      <Text style={styles.challengeDescription}>{challenge.description}</Text>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(challenge.progress / challenge.total) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round((challenge.progress / challenge.total) * 100)}%
        </Text>
      </View>

      <View style={styles.challengeMeta}>
        <View style={styles.challengeReward}>
          <Ionicons name="trophy" size={16} color={theme.colors.accent} />
          <Text style={styles.rewardText}>{challenge.reward}</Text>
        </View>
        <Text style={styles.participantsText}>
          {challenge.participants} participants
        </Text>
      </View>

      <Text style={styles.challengeEndDate}>
        Ends: {new Date(challenge.endDate).toLocaleDateString()}
      </Text>
    </View>
  );

  const TabButton = ({ tab, title, icon, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isActive ? theme.colors.primary : theme.colors.textSecondary}
      />
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderFeedTab = () => (
    <ScrollView
      style={styles.feedContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <Image source={{ uri: user?.avatar }} style={styles.userAvatarSmall} />
        <TouchableOpacity
          style={styles.createPostInput}
          onPress={() => setShowNewPost(true)}
        >
          <Text style={styles.createPostPlaceholder}>
            Share your wildlife discovery...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraPostButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,247</Text>
          <Text style={styles.statLabel}>Sightings Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Species Found</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3,421</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
      </View>

      {/* Posts Feed */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* New Post Modal */}
      {showNewPost && (
        <View style={styles.newPostModal}>
          <View style={styles.newPostHeader}>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.newPostTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.postButton}>Post</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.newPostInput}
            placeholder="Share your wildlife experience..."
            placeholderTextColor={theme.colors.placeholder}
            value={newPostText}
            onChangeText={setNewPostText}
            multiline
            autoFocus
          />
        </View>
      )}
    </ScrollView>
  );

  const renderCommunitiesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Communities</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {communities.filter(c => c.joined).map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Discover Communities</Text>
      </View>

      {communities.filter(c => !c.joined).map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </ScrollView>
  );

  const renderChallengesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.challengesHeader}>
        <Text style={styles.sectionTitle}>Active Challenges</Text>
        <Text style={styles.challengesSubtitle}>
          Complete challenges to earn points and badges!
        </Text>
      </View>

      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}

      <View style={styles.leaderboardPreview}>
        <Text style={styles.sectionTitle}>This Month's Leaders</Text>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderRank}>1.</Text>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.leaderAvatar} 
          />
          <Text style={styles.leaderName}>Dr. Sarah Johnson</Text>
          <Text style={styles.leaderPoints}>2,450 pts</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderRank}>2.</Text>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.leaderAvatar} 
          />
          <Text style={styles.leaderName}>Mike Conservation</Text>
          <Text style={styles.leaderPoints}>2,180 pts</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderRank}>3.</Text>
          <Image 
            source={{ uri: user?.avatar }} 
            style={styles.leaderAvatar} 
          />
          <Text style={[styles.leaderName, { color: theme.colors.primary }]}>
            {user?.name} (You)
          </Text>
          <Text style={styles.leaderPoints}>1,850 pts</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          tab="feed"
          title="Feed"
          icon="home-outline"
          isActive={activeTab === 'feed'}
          onPress={() => setActiveTab('feed')}
        />
        <TabButton
          tab="communities"
          title="Groups"
          icon="people-outline"
          isActive={activeTab === 'communities'}
          onPress={() => setActiveTab('communities')}
        />
        <TabButton
          tab="challenges"
          title="Challenges"
          icon="trophy-outline"
          isActive={activeTab === 'challenges'}
          onPress={() => setActiveTab('challenges')}
        />
      </View>

      {/* Tab Content */}
      {activeTab === 'feed' && renderFeedTab()}
      {activeTab === 'communities' && renderCommunitiesTab()}
      {activeTab === 'challenges' && renderChallengesTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: theme.colors.primary,
  },
  tabButtonText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: theme.colors.primary,
  },
  feedContainer: {
    flex: 1,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  createPostPlaceholder: {
    ...typography.body2,
    color: theme.colors.placeholder,
  },
  cameraPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h4,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: spacing.md,
  },
  postCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  userBadgeText: {
    ...typography.caption,
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  postTime: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  postMenu: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    ...typography.body1,
    color: theme.colors.text,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  postImage: {
    width: '100%',
    height: 250,
    marginBottom: spacing.sm,
  },
  speciesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  speciesTagText: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  locationIcon: {
    marginLeft: spacing.sm,
  },
  locationText: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: spacing.xs,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: spacing.xs,
  },
  newPostModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    zIndex: 1000,
  },
  newPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelButton: {
    ...typography.body1,
    color: theme.colors.textSecondary,
  },
  newPostTitle: {
    ...typography.h5,
    color: theme.colors.text,
    fontWeight: '600',
  },
  postButton: {
    ...typography.body1,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  newPostInput: {
    flex: 1,
    ...typography.body1,
    color: theme.colors.text,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  tabContent: {
    flex: 1,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: theme.colors.text,
    fontWeight: '600',
  },
  seeAllText: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  communityImage: {
    width: 60,
    height: 60,
    borderRadius: theme.roundness,
    marginRight: spacing.md,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  communityDescription: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  communityMembers: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.roundness,
  },
  joinedButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  joinButtonText: {
    ...typography.body2,
    color: 'white',
    fontWeight: '500',
  },
  joinedButtonText: {
    color: theme.colors.textSecondary,
  },
  challengesHeader: {
    marginBottom: spacing.lg,
  },
  challengesSubtitle: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  challengeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  challengeProgress: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  progressText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  challengeDescription: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  progressPercentage: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardText: {
    ...typography.caption,
    color: theme.colors.text,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  participantsText: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  challengeEndDate: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  leaderboardPreview: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.small,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  leaderRank: {
    ...typography.body1,
    fontWeight: '700',
    color: theme.colors.primary,
    width: 30,
  },
  leaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  leaderName: {
    ...typography.body2,
    color: theme.colors.text,
    flex: 1,
    fontWeight: '500',
  },
  leaderPoints: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default SocialScreen;

  const CommunityCard = ({ community }) => (
    <View style={styles.communityCard}>
      <Image source={{ uri: community.image }} style={styles.communityImage} />
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{community.name}</Text>
        <Text style={styles.communityDescription}>{community.description}</Text>
        <Text style={styles.communityMembers}>{community.members.toLocaleString()} members</Text>
      </View>
      <TouchableOpacity
        style={[styles.joinButton, community.joined && styles.joinedButton]}
      >
        <Text style={[styles.joinButtonText, community.joined && styles.joinedButtonText]}>
          {community.joined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity> 