import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSpecies } from '../context/SpeciesContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const { user, logout } = useAuth();
  const { sightings, species } = useSpecies();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've spotted ${user?.sightings || 0} wildlife species on WildLink! Join me in exploring and protecting our amazing wildlife. 🐾`,
        title: 'Join me on WildLink!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const achievements = [
    { id: '1', name: 'First Sighting', icon: 'eye', earned: true, date: '2025-07-15' },
    { id: '2', name: 'Early Bird', icon: 'sunny', earned: true, date: '2025-07-20' },
    { id: '3', name: 'Night Owl', icon: 'moon', earned: false },
    { id: '4', name: 'Species Explorer', icon: 'leaf', earned: true, date: '2025-08-01' },
    { id: '5', name: 'Conservation Hero', icon: 'heart', earned: false },
    { id: '6', name: 'Photo Master', icon: 'camera', earned: false },
  ];

  const recentSightings = sightings.slice(0, 6);

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const AchievementBadge = ({ achievement }) => (
    <View style={[styles.achievementBadge, !achievement.earned && styles.lockedBadge]}>
      <View style={[styles.badgeIcon, !achievement.earned && styles.lockedIcon]}>
        <Ionicons
          name={achievement.icon}
          size={20}
          color={achievement.earned ? theme.colors.accent : theme.colors.disabled}
        />
      </View>
      <Text style={[styles.badgeName, !achievement.earned && styles.lockedBadgeName]}>
        {achievement.name}
      </Text>
      {achievement.earned && achievement.date && (
        <Text style={styles.badgeDate}>
          {new Date(achievement.date).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  const SightingThumbnail = ({ sighting }) => (
    <TouchableOpacity style={styles.sightingThumbnail}>
      <Image
        source={{ uri: sighting.image || 'https://via.placeholder.com/100' }}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
      <Text style={styles.thumbnailSpecies} numberOfLines={1}>
        {sighting.speciesName}
      </Text>
      <Text style={styles.thumbnailDate}>
        {new Date(sighting.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <StatCard
          icon="eye-outline"
          value={user?.sightings || 0}
          label="Total Sightings"
          color={theme.colors.primary}
        />
        <StatCard
          icon="leaf-outline"
          value={species.length}
          label="Species Identified"
          color={theme.colors.secondary}
        />
        <StatCard
          icon="school-outline"
          value={user?.courses || 0}
          label="Courses Completed"
          color={theme.colors.accent}
        />
        <StatCard
          icon="people-outline"
          value={user?.contributions || 0}
          label="Community Posts"
          color={theme.colors.success}
        />
      </View>

      <View style={styles.levelProgress}>
        <Text style={styles.sectionTitle}>Conservation Level</Text>
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Text style={styles.currentLevel}>{user?.level || 'Beginner'}</Text>
            <Text style={styles.pointsText}>{user?.points || 0} points</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((user?.points || 0) % 1000) / 10}%` }
                ]}
              />
            </View>
            <Text style={styles.nextLevelText}>
              {1000 - ((user?.points || 0) % 1000)} points to next level
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.monthlyStats}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.monthlyGrid}>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>12</Text>
            <Text style={styles.monthlyLabel}>New Sightings</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>3</Text>
            <Text style={styles.monthlyLabel}>New Species</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>8</Text>
            <Text style={styles.monthlyLabel}>Photos Shared</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAchievementsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your Achievements</Text>
      <Text style={styles.achievementStats}>
        {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
      </Text>
      
      <View style={styles.achievementsGrid}>
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </View>

      <View style={styles.nextAchievements}>
        <Text style={styles.sectionTitle}>Coming Next</Text>
        <View style={styles.nextAchievementCard}>
          <Ionicons name="trophy-outline" size={24} color={theme.colors.accent} />
          <View style={styles.nextAchievementInfo}>
            <Text style={styles.nextAchievementName}>Conservation Hero</Text>
            <Text style={styles.nextAchievementDescription}>
              Make 5 conservation donations or join 3 local groups
            </Text>
            <View style={styles.nextAchievementProgress}>
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={[styles.progressDot, styles.inactiveProgressDot]} />
              <View style={[styles.progressDot, styles.inactiveProgressDot]} />
              <View style={[styles.progressDot, styles.inactiveProgressDot]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSightingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sightingsHeader}>
        <Text style={styles.sectionTitle}>Your Sightings</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentSightings.length > 0 ? (
        <View style={styles.sightingsGrid}>
          {recentSightings.map((sighting, index) => (
            <SightingThumbnail key={index} sighting={sighting} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={64} color={theme.colors.disabled} />
          <Text style={styles.emptyStateTitle}>No sightings yet</Text>
          <Text style={styles.emptyStateText}>
            Start exploring and document your first wildlife encounter!
          </Text>
          <TouchableOpacity
            style={styles.startExploringButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.startExploringText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.favoriteSpecies}>
        <Text style={styles.sectionTitle}>Favorite Species</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(user?.favoriteSpecies || []).map((speciesName, index) => (
            <View key={index} style={styles.favoriteSpeciesCard}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80' }}
                style={styles.favoriteSpeciesImage}
              />
              <Text style={styles.favoriteSpeciesName}>{speciesName}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const TabButton = ({ tab, title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/80' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Wildlife Explorer'}</Text>
              <Text style={styles.profileLocation}>{user?.location || 'Location not set'}</Text>
              <View style={styles.joinedInfo}>
                <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.joinedText}>
                  Joined {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{user?.sightings || 0}</Text>
            <Text style={styles.quickStatLabel}>Sightings</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{user?.points || 0}</Text>
            <Text style={styles.quickStatLabel}>Points</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{achievements.filter(a => a.earned).length}</Text>
            <Text style={styles.quickStatLabel}>Badges</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{user?.level || 'Beginner'}</Text>
            <Text style={styles.quickStatLabel}>Level</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          tab="stats"
          title="Stats"
          isActive={activeTab === 'stats'}
          onPress={() => setActiveTab('stats')}
        />
        <TabButton
          tab="achievements"
          title="Achievements"
          isActive={activeTab === 'achievements'}
          onPress={() => setActiveTab('achievements')}
        />
        <TabButton
          tab="sightings"
          title="Sightings"
          isActive={activeTab === 'sightings'}
          onPress={() => setActiveTab('sightings')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'sightings' && renderSightingsTab()}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.notification} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: 'white',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  profileLocation: {
    ...typography.body2,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.xs,
  },
  joinedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.roundness,
    paddingVertical: spacing.md,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    ...typography.h4,
    color: 'white',
    fontWeight: '700',
  },
  quickStatLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: theme.colors.primary,
  },
  tabButtonText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  levelProgress: {
    marginBottom: spacing.lg,
  },
  levelCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    ...shadows.small,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currentLevel: {
    ...typography.h4,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  pointsText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  nextLevelText: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  monthlyStats: {
    marginBottom: spacing.lg,
  },
  monthlyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    paddingVertical: spacing.md,
    ...shadows.small,
  },
  monthlyItem: {
    alignItems: 'center',
  },
  monthlyValue: {
    ...typography.h3,
    color: theme.colors.accent,
    fontWeight: '700',
  },
  monthlyLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  achievementStats: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  achievementBadge: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lockedIcon: {
    backgroundColor: theme.colors.disabled,
  },
  badgeName: {
    ...typography.body2,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  lockedBadgeName: {
    color: theme.colors.disabled,
  },
  badgeDate: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  nextAchievements: {
    marginBottom: spacing.lg,
  },
  nextAchievementCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    ...shadows.small,
  },
  nextAchievementInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nextAchievementName: {
    ...typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  nextAchievementDescription: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  nextAchievementProgress: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
    marginRight: spacing.xs,
  },
  inactiveProgressDot: {
    backgroundColor: theme.colors.border,
  },
  sightingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  sightingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sightingThumbnail: {
    width: '31%',
    marginBottom: spacing.md,
  },
  thumbnailImage: {
    width: '100%',
    height: 80,
    borderRadius: theme.roundness,
    marginBottom: spacing.xs,
  },
  thumbnailSpecies: {
    ...typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  thumbnailDate: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.h4,
    color: theme.colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body2,
    color: theme.colors.disabled,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  startExploringButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: theme.roundness,
  },
  startExploringText: {
    ...typography.button,
    color: 'white',
    fontWeight: '500',
  },
  favoriteSpecies: {
    marginBottom: spacing.lg,
  },
  favoriteSpeciesCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  favoriteSpeciesImage: {
    width: 60,
    height: 60,
    borderRadius: theme.roundness,
    marginBottom: spacing.xs,
  },
  favoriteSpeciesName: {
    ...typography.caption,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoutText: {
    ...typography.button,
    color: theme.colors.notification,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
});

export default ProfileScreen; 