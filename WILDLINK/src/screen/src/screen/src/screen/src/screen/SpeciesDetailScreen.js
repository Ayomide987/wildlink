import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSpecies } from '../context/SpeciesContext';
import { useAuth } from '../context/AuthContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SpeciesDetailScreen = ({ route, navigation }) => {
  const { speciesId } = route.params;
  const [species, setSpecies] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { getSpeciesById, addSighting } = useSpecies();
  const { user } = useAuth();

  useEffect(() => {
    const speciesData = getSpeciesById(speciesId);
    setSpecies(speciesData);
    
    // Check if species is in user's favorites
    if (user?.favoriteSpecies?.includes(speciesData?.name)) {
      setIsFavorite(true);
    }
  }, [speciesId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing ${species.name} on WildLink! ${species.description}`,
        title: species.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddSighting = () => {
    Alert.alert(
      'Add Sighting',
      `Did you spot a ${species.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I saw one!',
          onPress: () => navigation.navigate('Camera', { preSelectedSpecies: species })
        }
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Update user favorites in context
  };

  if (!species) {
    return (
      <View style={styles.container}>
        <Text>Species not found</Text>
      </View>
    );
  }

  const getConservationStatusColor = (status) => {
    switch (status) {
      case 'Critically Endangered': return theme.colors.notification;
      case 'Endangered': return theme.colors.warning;
      case 'Vulnerable': return theme.colors.accent;
      case 'Near Threatened': return theme.colors.secondary;
      case 'Least Concern': return theme.colors.success;
      default: return theme.colors.disabled;
    }
  };

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

  const FactItem = ({ icon, title, content }) => (
    <View style={styles.factItem}>
      <View style={styles.factIcon}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.factContent}>
        <Text style={styles.factTitle}>{title}</Text> 