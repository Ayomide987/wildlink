import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpecies } from '../context/SpeciesContext';
import { useLocation } from '../context/LocationContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const { width } = Dimensions.get('window');

const DiscoverScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const { species, searchSpecies } = useSpecies();
  const { getNearbyWildlife } = useLocation();

  const categories = ['All', 'Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Insect', 'Marine'];

  useEffect(() => {
    filterSpecies();
  }, [searchQuery, selectedCategory, species]);

  const filterSpecies = () => {
    let filtered = searchSpecies(searchQuery);
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    setFilteredSpecies(filtered);
  };

  const CategoryButton = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}
      onPress={onPress}
    >
      <Text style={[styles.categoryButtonText, isSelected && styles.selectedCategoryButtonText]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const SpeciesGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('SpeciesDetail', { speciesId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
        style={styles.gridImage}
        resizeMode="cover"
      />
      <View style={styles.gridItemContent}>
        <Text style={styles.gridItemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.gridItemScientific} numberOfLines={1}>{item.scientificName}</Text>
        <View style={styles.gridItemMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.conservationStatus) }]}>
            <Text style={styles.statusText}>{getStatusAbbreviation(item.conservationStatus)}</Text>
          </View>
          <Text style={styles.gridItemCategory}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SpeciesListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('SpeciesDetail', { speciesId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
        style={styles.listImage}
        resizeMode="cover"
      />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <Text style={styles.listItemScientific}>{item.scientificName}</Text>
        <Text style={styles.listItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.listItemMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.conservationStatus) }]}>
            <Text style={styles.statusText}>{item.conservationStatus}</Text>
          </View>
          <Text style={styles.listItemRegion}>{item.region}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critically Endangered': return theme.colors.notification;
      case 'Endangered': return theme.colors.warning;
      case 'Vulnerable': return theme.colors.accent;
      case 'Near Threatened': return theme.colors.secondary;
      case 'Least Concern': return theme.colors.success;
      default: return theme.colors.disabled;
    }
  };

  const getStatusAbbreviation = (status) => {
    switch (status) {
      case 'Critically Endangered': return 'CE';
      case 'Endangered': return 'EN';
      case 'Vulnerable': return 'VU';
      case 'Near Threatened': return 'NT';
      case 'Least Concern': return 'LC';
      default: return 'UN';
    }
  };

  const QuickFilterButton = ({ icon, title, onPress, count }) => (
    <TouchableOpacity style={styles.quickFilter} onPress={onPress}>
      <View style={styles.quickFilterIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.quickFilterTitle}>{title}</Text>
      <Text style={styles.quickFilterCount}>{count}</Text>
    </TouchableOpacity>
  );

  const nearbyWildlife = getNearbyWildlife();
  const endangeredSpecies = species.filter(s => 
    s.conservationStatus === 'Critically Endangered' || s.conservationStatus === 'Endangered'
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Wildlife</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Ionicons name="map" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species, scientific names..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Filters */}
        {searchQuery === '' && (
          <View style={styles.quickFiltersContainer}>
            <Text style={styles.sectionTitle}>Quick Discover</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <QuickFilterButton
                icon="location"
                title="Nearby"
                count={nearbyWildlife.length}
                onPress={() => {
                  // Filter to show only nearby species
                  setFilteredSpecies(species.filter(s => 
                    nearbyWildlife.some(n => n.name === s.name)
                  ));
                }}
              />
              <QuickFilterButton
                icon="warning"
                title="Endangered"
                count={endangeredSpecies.length}
                onPress={() => {
                  setFilteredSpecies(endangeredSpecies);
                }}
              />
              <QuickFilterButton
                icon="eye"
                title="Recently Spotted"
                count={12}
                onPress={() => {
                  // Show recently spotted species
                }}
              />
              <QuickFilterButton
                icon="star"
                title="Popular"
                count={species.length}
                onPress={() => {
                  setFilteredSpecies(species);
                }}
              />
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Species List */}
        <View style={styles.speciesContainer}>
          <View style={styles.speciesHeader}>
            <Text style={styles.speciesCount}>
              {filteredSpecies.length} species found
            </Text>
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredSpecies.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyStateTitle}>No species found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter criteria
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredSpecies}
              keyExtractor={(item) => item.id}
              renderItem={viewMode === 'grid' ? SpeciesGridItem : SpeciesListItem}
              numColumns={viewMode === 'grid' ? 2 : 1}
              key={viewMode} // Force re-render when view mode changes
              columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : null}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // Let parent ScrollView handle scrolling
            />
          )}
        </View>

        {/* Conservation Message */}
        <View style={styles.conservationMessage}>
          <View style={styles.conservationIcon}>
            <Ionicons name="leaf" size={24} color={theme.colors.success} />
          </View>
          <View style={styles.conservationContent}>
            <Text style={styles.conservationTitle}>Help Protect Wildlife</Text>
            <Text style={styles.conservationText}>
              Every species identification and sighting you record contributes to wildlife conservation efforts worldwide.
            </Text>
          </View>
        </View>
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
    alignItems: 'center',
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body1,
    color: theme.colors.text,
    marginLeft: spacing.sm,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  quickFiltersContainer: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: theme.colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  quickFilter: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginLeft: spacing.md,
    minWidth: 80,
    ...shadows.small,
  },
  quickFilterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickFilterTitle: {
    ...typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quickFilterCount: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  categoriesContainer: {
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginLeft: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    ...typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  speciesContainer: {
    padding: spacing.md,
  },
  speciesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  speciesCount: {
    ...typography.body1,
    color: theme.colors.textSecondary,
  },
  clearSearch: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - spacing.md * 3) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridItemContent: {
    padding: spacing.sm,
  },
  gridItemName: {
    ...typography.body2,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  gridItemScientific: {
    ...typography.caption,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  gridItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemCategory: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: theme.roundness,
    marginRight: spacing.md,
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  listItemScientific: {
    ...typography.body2,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  listItemDescription: {
    ...typography.body2,
    color: theme.colors.text,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  listItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRegion: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    ...typography.h4,
    color: theme.colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body1,
    color: theme.colors.disabled,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: theme.roundness,
  },
  resetButtonText: {
    ...typography.button,
    color: 'white',
    fontWeight: '500',
  },
  conservationMessage: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    margin: spacing.md,
    marginTop: spacing.lg,
    ...shadows.small,
  },
  conservationIcon: {
    marginRight: spacing.md,
  },
  conservationContent: {
    flex: 1,
  },
  conservationTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  conservationText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default DiscoverScreen; 