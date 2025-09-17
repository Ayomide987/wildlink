import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSpecies } from '../context/SpeciesContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { location, getNearbyWildlife } = useLocation();
  const { getRecentSightings } = useSpecies();
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyWildlife, setNearbyWildlife] = useState([]);
  const [recentSightings, setRecentSightings] = useState([]);
  const [todayStats, setTodayStats] = useState({
    sightings: 0,
    newSpecies: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadHomeData();
  }, [location]);

  const loadHomeData = () => {
    const nearby = getNearbyWildlife();
    const recent = getRecentSightings(5);
    
    setNearbyWildlife(nearby);
    setRecentSightings(recent);
    
    // Mock today's stats
    setTodayStats({
      sightings: Math.floor(Math.random() * 50) + 20,
      newSpecies: Math.floor(Math.random() * 5) + 1,
      activeUsers: Math.floor(Math.random() * 200) + 100,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadHomeData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatsCard = ({ icon, value, label, color }) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statsContent}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsLabel}>{label}</Text>
      </View>
    </View>
  );

  const SpeciesCard = ({ species, onPress }) => (
    <TouchableOpacity style={styles.speciesCard} onPress={onPress}>
      <Image
        source={{ uri: species.image || 'https://via.placeholder.com/150' }}
        style={styles.speciesImage}
        resizeMode="cover"
      />
      <View style={styles.speciesInfo}>
        <Text style={styles.speciesName}>{species.name}</Text>
        <Text style={styles.speciesDistance}>{species.distance}</Text>
        <View style={styles.speciesMetadata}>
          <View style={[styles.rarityBadge, { 
            backgroundColor: species.rarity === 'Rare' ? theme.colors.warning : theme.colors.success 
          }]}>
            <Text style={styles.rarityText}>{species.rarity}</Text>
          </View>
          <Text style={styles.lastSeen}>{species.lastSeen}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0] || 'Explorer'}!</Text>
            <Text style={styles.subtitle}>Ready to discover wildlife?</Text>
            {location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="white" />
                <Text style={styles.locationText}>
                  {location.address.city}, {location.address.country}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{user?.level?.[0] || 'B'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Today's Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.statsContainer}>
          <StatsCard
            icon="eye-outline"
            value={todayStats.sightings}
            label="Sightings"
            color={theme.colors.primary}
          />
          <StatsCard
            icon="leaf-outline"
            value={todayStats.newSpecies}
            label="New Species"
            color={theme.colors.accent}
          />
          <StatsCard
            icon="people-outline"
            value={todayStats.activeUsers}
            label="Active Users"
            color={theme.colors.secondary}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            icon="camera-outline"
            title="Identify Species"
            color={theme.colors.primary}
            onPress={() => navigation.navigate('Camera')}
          />
          <QuickActionButton
            icon="map-outline"
            title="Explore Map"
            color={theme.colors.secondary}
            onPress={() => navigation.navigate('Map')}
          />
          <QuickActionButton
            icon="book-outline"
            title="Learn"
            color={theme.colors.accent}
            onPress={() => navigation.navigate('Course')}
          />
          <QuickActionButton
            icon="people-outline"
            title="Community"
            color={theme.colors.warning}
            onPress={() => navigation.navigate('Social')}
          />
        </View>
      </View>

      {/* Nearby Wildlife */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Wildlife</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nearbyWildlife.map((species) => (
            <SpeciesCard
              key={species.id}
              species={species}
              onPress={() => navigation.navigate('SpeciesDetail', { speciesId: species.id })}
            />
          ))}
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Community Activity</Text>
        {recentSightings.length > 0 ? (
          recentSightings.map((sighting, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="eye" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityUser}>{sighting.userName || 'Anonymous'}</Text>
                  {' '}spotted a{' '}
                  <Text style={styles.activitySpecies}>{sighting.speciesName}</Text>
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(sighting.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color={theme.colors.disabled} />
            <Text style={styles.emptyStateText}>No recent activity</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to spot wildlife in your area!
            </Text>
          </View>
        )}
      </View>

      {/* Conservation Tip */}
      <View style={styles.section}>
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="lightbulb" size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Conservation Tip</Text>
            <Text style={styles.tipText}>
              Early morning and late afternoon are the best times to spot wildlife. 
              Animals are most active during these cooler parts of the day.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  greeting: {
    ...typography.h3,
    color: 'white',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: spacing.xs,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  statsIcon: {
    marginRight: spacing.sm,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    ...typography.h4,
    color: theme.colors.text,
    fontWeight: '700',
  },
  statsLabel: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    ...typography.caption,
    color: theme.colors.text,
    textAlign: 'center',
  },
  speciesCard: {
    width: width * 0.4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  speciesImage: {
    width: '100%',
    height: 100,
  },
  speciesInfo: {
    padding: spacing.sm,
  },
  speciesName: {
    ...typography.body2,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  speciesDistance: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  speciesMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rarityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    ...typography.caption,
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  lastSeen: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...typography.body2,
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  activityUser: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  activitySpecies: {
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  activityTime: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    ...typography.caption,
    color: theme.colors.disabled,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.small,
  },
  tipIcon: {
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen; 