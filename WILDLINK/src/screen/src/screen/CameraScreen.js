import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSpecies } from '../context/SpeciesContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { theme, spacing, typography, shadows } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [identificationMode, setIdentificationMode] = useState('photo'); // 'photo' or 'sound'
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [recording, setRecording] = useState(null);
  
  const cameraRef = useRef(null);
  const { addSighting } = useSpecies();
  const { location } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted' && audioStatus.status === 'granted');
    })();
  }, []);

  const mockIdentifySpecies = async (imageUri) => {
    // Mock AI identification - replace with actual API call
    const mockResults = [
      {
        species: 'African Fish Eagle',
        scientificName: 'Haliaeetus vocifer',
        confidence: 0.89,
        category: 'Bird',
        conservationStatus: 'Least Concern',
        description: 'The African fish eagle is a large species of eagle found throughout sub-Saharan Africa.',
        habitat: 'Rivers, lakes, coastlines',
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
        facts: [
          'National bird of Zambia and Zimbabwe',
          'Distinctive white head and tail',
          'Excellent fishers and hunters'
        ]
      },
      {
        species: 'Pied Kingfisher',
        scientificName: 'Ceryle rudis',
        confidence: 0.76,
        category: 'Bird',
        conservationStatus: 'Least Concern',
        description: 'A water kingfisher widely distributed across Africa and Asia.',
        habitat: 'Rivers, lakes, coastal areas',
        image: 'https://images.unsplash.com/photo-1544550285-f813152fb2fd?w=500',
        facts: [
          'Can hover over water while hunting',
          'Black and white plumage pattern',
          'Nests in burrows in riverbanks'
        ]
      }
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockResults;
  };

  const mockIdentifySound = async (audioUri) => {
    // Mock sound identification
    const mockSoundResults = [
      {
        species: 'African Grey Parrot',
        scientificName: 'Psittacus erithacus',
        confidence: 0.82,
        category: 'Bird',
        soundType: 'Call',
        description: 'Highly intelligent parrot known for its ability to mimic human speech.',
        facts: ['Can live up to 50-60 years', 'Excellent mimics', 'Highly social birds']
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockSoundResults;
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsIdentifying(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        const results = await mockIdentifySpecies(photo.uri);
        setIdentificationResult({
          type: 'photo',
          image: photo.uri,
          results: results,
        });
        setShowResult(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsIdentifying(false);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsIdentifying(true);
      try {
        const results = await mockIdentifySpecies(result.assets[0].uri);
        setIdentificationResult({
          type: 'photo',
          image: result.assets[0].uri,
          results: results,
        });
        setShowResult(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to identify species');
      } finally {
        setIsIdentifying(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsIdentifying(true);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      const results = await mockIdentifySound(uri);
      setIdentificationResult({
        type: 'sound',
        audio: uri,
        results: results,
      });
      setShowResult(true);
      setRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to process audio');
    } finally {
      setIsIdentifying(false);
    }
  };

  const saveSighting = async (selectedSpecies) => {
    try {
      const sightingData = {
        speciesId: selectedSpecies.species,
        speciesName: selectedSpecies.species,
        scientificName: selectedSpecies.scientificName,
        confidence: selectedSpecies.confidence,
        location: location?.coords,
        address: location?.address,
        image: identificationResult.image,
        notes: '',
        userName: user?.name || 'Anonymous',
        userId: user?.id,
      };

      await addSighting(sightingData);
      Alert.alert(
        'Sighting Saved!',
        `Your ${selectedSpecies.species} sighting has been added to your journal.`,
        [
          { text: 'View Details', onPress: () => navigation.navigate('SpeciesDetail', { speciesId: selectedSpecies.species }) },
          { text: 'Take Another', onPress: () => setShowResult(false) }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save sighting');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={theme.colors.disabled} />
        <Text style={styles.permissionText}>Camera and microphone access required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const IdentificationModeButton = ({ mode, icon, title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.modeButton, isActive && styles.activeModeButton]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={isActive ? 'white' : theme.colors.primary} />
      <Text style={[styles.modeButtonText, isActive && styles.activeModeButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ResultCard = ({ result, onSelect }) => (
    <TouchableOpacity style={styles.resultCard} onPress={() => onSelect(result)}>
      <Image source={{ uri: result.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={styles.resultSpecies}>{result.species}</Text>
        <Text style={styles.resultScientific}>{result.scientificName}</Text>
        <View style={styles.confidenceContainer}>
          <View style={[styles.confidenceBar, { width: `${result.confidence * 100}%` }]} />
        </View>
        <Text style={styles.confidenceText}>{Math.round(result.confidence * 100)}% confidence</Text>
        <Text style={styles.resultCategory}>{result.category} • {result.conservationStatus}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {identificationMode === 'photo' ? (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'transparent']}
              style={styles.topOverlay}
            >
              <View style={styles.headerControls}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.centerOverlay}>
              <View style={styles.focusFrame} />
              <Text style={styles.instructionText}>
                Point camera at wildlife to identify
              </Text>
            </View>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.bottomOverlay}
            >
              <View style={styles.modeSelector}>
                <IdentificationModeButton
                  mode="photo"
                  icon="camera-outline"
                  title="Photo ID"
                  isActive={identificationMode === 'photo'}
                  onPress={() => setIdentificationMode('photo')}
                />
                <IdentificationModeButton
                  mode="sound"
                  icon="mic-outline"
                  title="Sound ID"
                  isActive={identificationMode === 'sound'}
                  onPress={() => setIdentificationMode('sound')}
                />
              </View>

              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                  <Ionicons name="images-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.captureButton, isIdentifying && styles.capturingButton]}
                  onPress={takePicture}
                  disabled={isIdentifying}
                >
                  {isIdentifying ? (
                    <View style={styles.loadingIndicator} />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.flashButton}>
                  <Ionicons name="flash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Camera>
      ) : (
        <View style={styles.soundMode}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.soundModeBackground}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.soundModeContent}>
              <View style={[styles.microphoneContainer, isRecording && styles.recordingMic]}>
                <Ionicons
                  name={isRecording ? "mic" : "mic-outline"}
                  size={64}
                  color="white"
                />
                {isRecording && (
                  <View style={styles.soundWaves}>
                    {[...Array(3)].map((_, i) => (
                      <View key={i} style={[styles.soundWave, { animationDelay: `${i * 0.2}s` }]} />
                    ))}
                  </View>
                )}
              </View>

              <Text style={styles.soundInstructionTitle}>
                {isRecording ? 'Listening...' : 'Sound Identification'}
              </Text>
              <Text style={styles.soundInstructionText}>
                {isRecording
                  ? 'Recording wildlife sounds for identification'
                  : 'Tap and hold to record wildlife sounds'}
              </Text>

              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
                disabled={isIdentifying}
              >
                <Text style={styles.recordButtonText}>
                  {isIdentifying ? 'Identifying...' : (isRecording ? 'Release to Stop' : 'Hold to Record')}
                </Text>
              </TouchableOpacity>

              <View style={styles.modeSelector}>
                <IdentificationModeButton
                  mode="photo"
                  icon="camera-outline"
                  title="Photo ID"
                  isActive={identificationMode === 'photo'}
                  onPress={() => setIdentificationMode('photo')}
                />
                <IdentificationModeButton
                  mode="sound"
                  icon="mic-outline"
                  title="Sound ID"
                  isActive={identificationMode === 'sound'}
                  onPress={() => setIdentificationMode('sound')}
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Identification Results Modal */}
      <Modal
        visible={showResult}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Identification Results</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowResult(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {identificationResult?.image && (
              <Image
                source={{ uri: identificationResult.image }}
                style={styles.capturedImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.resultsHeader}>
              Found {identificationResult?.results?.length || 0} possible matches:
            </Text>

            {identificationResult?.results?.map((result, index) => (
              <ResultCard
                key={index}
                result={result}
                onSelect={saveSighting}
              />
            ))}

            <TouchableOpacity
              style={styles.notFoundButton}
              onPress={() => {
                Alert.alert(
                  'Species Not Found?',
                  'Help us improve by submitting this sighting for expert review.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Submit for Review', onPress: () => setShowResult(false) }
                  ]
                );
              }}
            >
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.notFoundText}>Species not listed?</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topOverlay: {
    paddingTop: 50,
    paddingHorizontal: spacing.md,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructionText: {
    ...typography.body1,
    color: 'white',
    textAlign: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.roundness,
  },
  bottomOverlay: {
    paddingBottom: 50,
    paddingHorizontal: spacing.md,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginHorizontal: spacing.sm,
  },
  activeModeButton: {
    backgroundColor: theme.colors.primary,
  },
  modeButtonText: {
    ...typography.body2,
    color: theme.colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  activeModeButtonText: {
    color: 'white',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingButton: {
    backgroundColor: theme.colors.accent,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: theme.colors.primary,
  },
  loadingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'white',
    borderTopColor: 'transparent',
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundMode: {
    flex: 1,
  },
  soundModeBackground: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: spacing.md,
  },
  soundModeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  recordingMic: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  soundWaves: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  soundWave: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  soundInstructionTitle: {
    ...typography.h3,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  soundInstructionText: {
    ...typography.body1,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  recordButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    marginBottom: spacing.xl,
  },
  recordingButton: {
    backgroundColor: theme.colors.notification,
  },
  recordButtonText: {
    ...typography.button,
    color: 'white',
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.lg,
  },
  permissionText: {
    ...typography.h4,
    color: theme.colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: theme.roundness,
  },
  permissionButtonText: {
    ...typography.button,
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.roundness,
    marginVertical: spacing.md,
  },
  resultsHeader: {
    ...typography.h5,
    color: theme.colors.text,
    marginBottom: spacing.md,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: theme.roundness,
    marginRight: spacing.md,
  },
  resultContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultSpecies: {
    ...typography.body1,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  resultScientific: {
    ...typography.body2,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  confidenceContainer: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  confidenceBar: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 2,
  },
  confidenceText: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultCategory: {
    ...typography.caption,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  notFoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginVertical: spacing.md,
  },
  notFoundText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: spacing.xs,
  },
});

export default CameraScreen; 