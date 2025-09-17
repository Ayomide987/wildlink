import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpeciesContext = createContext();

export const useSpecies = () => {
  const context = useContext(SpeciesContext);
  if (!context) {
    throw new Error('useSpecies must be used within a SpeciesProvider');
  }
  return context;
};

export const SpeciesProvider = ({ children }) => {
  const [species, setSpecies] = useState([]);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpeciesData();
    loadSightings();
  }, []);

  const loadSpeciesData = async () => {
    try {
      // Load from local storage first
      const storedSpecies = await AsyncStorage.getItem('species');
      if (storedSpecies) {
        setSpecies(JSON.parse(storedSpecies));
      }

      // Mock species data - in production, this would come from an API
      const mockSpecies = [
        {
          id: '1',
          name: 'African Elephant',
          scientificName: 'Loxodonta africana',
          category: 'Mammal',
          habitat: 'Savanna, Forest',
          conservationStatus: 'Vulnerable',
          region: 'Sub-Saharan Africa',
          description: 'The African elephant is the largest living terrestrial animal. They are known for their intelligence, strong family bonds, and complex social behaviors.',
          images: [
            'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500',
            'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=500'
          ],
          sounds: ['https://example.com/elephant-trumpet.mp3'],
          facts: [
            'Can weigh up to 6,000 kg',
            'Have excellent memory',
            'Can live up to 70 years',
            'Consume 150-300 kg of vegetation daily'
          ],
          behavior: 'Highly social animals living in matriarchal herds',
          diet: 'Herbivore',
          size: '3-4 meters tall, 4-7 meters long',
          lifespan: '60-70 years',
          threats: ['Poaching', 'Habitat loss', 'Human-wildlife conflict']
        },
        {
          id: '2',
          name: 'Mountain Gorilla',
          scientificName: 'Gorilla beringei beringei',
          category: 'Mammal',
          habitat: 'Mountain forests',
          conservationStatus: 'Critically Endangered',
          region: 'Central and East Africa',
          description: 'Mountain gorillas are a subspecies of eastern gorilla found in the volcanic mountains of Rwanda, Uganda, and the Democratic Republic of Congo.',
          images: [
            'https://images.unsplash.com/photo-1526912284060-c4eadb04d98a?w=500',
            'https://images.unsplash.com/photo-1539681408380-2b45d4186c60?w=500'
          ],
          sounds: ['https://example.com/gorilla-grunt.mp3'],
          facts: [
            'Share 98% of human DNA',
            'Live in groups of 10-30 individuals',
            'Led by a dominant silverback male',
            'Only about 1,000 individuals remain'
          ],
          behavior: 'Live in social groups led by silverback males',
          diet: 'Herbivore',
          size: '1.25-1.75 meters tall',
          lifespan: '30-40 years',
          threats: ['Habitat destruction', 'Poaching', 'Disease', 'War']
        },
        {
          id: '3',
          name: 'Snow Leopard',
          scientificName: 'Panthera uncia',
          category: 'Mammal',
          habitat: 'High mountains',
          conservationStatus: 'Vulnerable',
          region: 'Central and South Asia',
          description: 'The snow leopard is a large cat native to the mountain ranges of Central and South Asia. It is well adapted to cold, arid environments.',
          images: [
            'https://images.unsplash.com/photo-1551882488-5e3fc1de0e78?w=500',
            'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500'
          ],
          sounds: ['https://example.com/snow-leopard-chuff.mp3'],
          facts: [
            'Cannot roar like other big cats',
            'Have large paws that act as snowshoes',
            'Can leap up to 15 meters',
            'Estimated 4,000-6,500 remain in wild'
          ],
          behavior: 'Solitary and elusive, most active at dawn and dusk',
          diet: 'Carnivore',
          size: '1.2-1.5 meters long',
          lifespan: '15-18 years',
          threats: ['Climate change', 'Poaching', 'Human-wildlife conflict', 'Habitat loss']
        },
        {
          id: '4',
          name: 'African Fish Eagle',
          scientificName: 'Haliaeetus vocifer',
          category: 'Bird',
          habitat: 'Rivers, lakes, coastlines',
          conservationStatus: 'Least Concern',
          region: 'Sub-Saharan Africa',
          description: 'The African fish eagle is a large species of eagle found throughout sub-Saharan Africa. It is the national bird of several African countries.',
          images: [
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
            'https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?w=500'
          ],
          sounds: ['https://example.com/fish-eagle-call.mp3'],
          facts: [
            'National bird of Zambia and Zimbabwe',
            'Distinctive white head and tail',
            'Excellent fishers and hunters',
            'Can dive at speeds up to 75 km/h'
          ],
          behavior: 'Often seen in pairs, builds large nests in tall trees',
          diet: 'Carnivore - primarily fish',
          size: '63-75 cm wingspan 2-2.4 meters',
          lifespan: '12-24 years',
          threats: ['Water pollution', 'Habitat destruction', 'Illegal trade']
        },
        {
          id: '5',
          name: 'Monarch Butterfly',
          scientificName: 'Danaus plexippus',
          category: 'Insect',
          habitat: 'Open areas, gardens, fields',
          conservationStatus: 'Endangered',
          region: 'North America',
          description: 'The monarch butterfly is known for its incredible multi-generational migration across North America, traveling up to 3,000 miles.',
          images: [
            'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=500',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
          ],
          sounds: [],
          facts: [
            'Migrates up to 3,000 miles',
            'Takes 4 generations to complete migration cycle',
            'Uses magnetic fields for navigation',
            'Population declined by 80% in recent decades'
          ],
          behavior: 'Undergoes complete metamorphosis, famous for long migrations',
          diet: 'Herbivore - milkweed plants',
          size: '8.9-10.2 cm wingspan',
          lifespan: '2-6 weeks (up to 8 months for migrating generation)',
          threats: ['Habitat loss', 'Pesticides', 'Climate change', 'Deforestation']
        }
      ];

      setSpecies(mockSpecies);
      await AsyncStorage.setItem('species', JSON.stringify(mockSpecies));
    } catch (error) {
      console.error('Error loading species data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSightings = async () => {
    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      if (storedSightings) {
        setSightings(JSON.parse(storedSightings));
      }
    } catch (error) {
      console.error('Error loading sightings:', error);
    }
  };

  const addSighting = async (sighting) => {
    try {
      const newSighting = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...sighting
      };
      
      const updatedSightings = [newSighting, ...sightings];
      setSightings(updatedSightings);
      await AsyncStorage.setItem('sightings', JSON.stringify(updatedSightings));
      
      return newSighting;
    } catch (error) {
      console.error('Error adding sighting:', error);
      throw error;
    }
  };

  const getSpeciesById = (id) => {
    return species.find(s => s.id === id);
  };

  const getSpeciesByCategory = (category) => {
    return species.filter(s => s.category === category);
  };

  const searchSpecies = (query) => {
    if (!query) return species;
    
    const searchTerm = query.toLowerCase();
    return species.filter(s => 
      s.name.toLowerCase().includes(searchTerm) ||
      s.scientificName.toLowerCase().includes(searchTerm) ||
      s.category.toLowerCase().includes(searchTerm) ||
      s.habitat.toLowerCase().includes(searchTerm) ||
      s.region.toLowerCase().includes(searchTerm)
    );
  };

  const getRecentSightings = (limit = 10) => {
    return sightings
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  };

  const value = {
    species,
    sightings,
    loading,
    addSighting,
    getSpeciesById,
    getSpeciesByCategory,
    searchSpecies,
    getRecentSightings,
    loadSpeciesData,
  };

  return (
    <SpeciesContext.Provider value={value}>
      {children}
    </SpeciesContext.Provider>
  );
}; 