import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {
  CameraDevices,
  Camera as CameraVision,
  PhotoFile,
  VideoFile,
  useCameraDevices,
} from 'react-native-vision-camera';
import {AppContext} from '../context';
import {Linking, TouchableOpacity, View, StyleSheet} from 'react-native';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from '../hook/useIsForeground';
import {showError} from '../utils/Toast';
import IconButton from '../components/control/IconButton';
import {NativeImage} from '../components/shared/NativeImage';
import {NativeVideo} from '../components/shared/NativeVideo';
import Header from '../components/header/Header';

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const Camera = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const devices: CameraDevices = useCameraDevices();
  const cameraRef = useRef<CameraVision>(null);

  const [cameraView, setCameraView] = useState('back');
  const [torch, setTorch] = useState<'on' | 'off' | 'auto'>('off');
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(devices[cameraView]);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  useEffect(() => {
    cameraPermission();
  }, []);

  useEffect(() => {
    setDevice(devices[cameraView]);
  }, [cameraView]);

  const cameraPermission = useCallback(async () => {
    const permission = await CameraVision.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const takePhoto = async () => {
    try {
      setLoading(true);
      if (cameraRef.current != null) {
        const photo: PhotoFile = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          flash: `${torch}`,
          enableAutoRedEyeReduction: true,
          enableAutoStabilization: true,
          skipMetadata: true,
        });
        setImageSource(photo.path);
        setShowCamera(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (cameraRef.current != null) {
        await cameraRef.current.startRecording({
          flash: `${torch}`,
          onRecordingFinished: (file: VideoFile) => {
            setImageSource(file.path);
          },
          onRecordingError: (error: any) => {
            console.warn(error);
          },
        });
      }
    } finally {
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    try {
      if (cameraRef.current != null) {
        await cameraRef.current.stopRecording();
      }
    } finally {
      setIsRecording(false);
    }
  };

  const upPost = async () => {
    try {
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {};

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View
        style={[
          styles(theme).row,
          {
            justifyContent: 'space-between',
          },
        ]}>
        {showCamera ? (
          <>
            <IconButton
              onPress={() => {
                navigation.navigate('Friend');
              }}
              Icon={() => (
                <Ionicons
                  name="people"
                  size={IconSizes.x7}
                  color={theme.text01}
                />
              )}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.placeholder,
                padding: IconSizes.x1,
                borderRadius: 50,
              }}
            />

            <IconButton
              onPress={() => {
                navigation.navigate('Setting');
              }}
              Icon={() => (
                <Ionicons
                  name="person-circle-outline"
                  size={IconSizes.x7}
                  color={theme.text01}
                />
              )}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.placeholder,
                padding: IconSizes.x1,
                borderRadius: 50,
              }}
            />
          </>
        ) : (
          <Header title="Send to..." />
        )}
      </View>
      <View style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}>
        {device && showCamera && (
          <>
            <CameraVision
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              photo={true}
              video={true}
              enableZoomGesture={true}
              orientation="portrait"
              lowLightBoost={true}
              onInitialized={onInitialized}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: IconSizes.x4,
              }}>
              <IconButton
                Icon={() => (
                  <Ionicons
                    name={mode === 'video' ? 'videocam' : 'videocam-outline'}
                    size={IconSizes.x6}
                    color={mode === 'video' ? theme.accent : theme.text01}
                  />
                )}
                onPress={() => {
                  mode === 'photo' ? setMode('video') : setMode('photo');
                }}
                style={{
                  padding: IconSizes.x1,
                  borderRadius: 50,
                }}
              />
              <IconButton
                Icon={() => (
                  <Ionicons
                    name={torch === 'on' ? 'flash' : 'flash-outline'}
                    size={IconSizes.x6}
                    color={torch === 'on' ? theme.accent : theme.text01}
                  />
                )}
                onPress={() => {
                  torch === 'off' ? setTorch('on') : setTorch('off');
                }}
                style={{
                  padding: IconSizes.x1,
                  borderRadius: 50,
                }}
              />
            </View>
          </>
        )}
        {!showCamera && imageSource && mode === 'photo' && (
          <NativeImage
            uri={`file://${imageSource}`}
            style={StyleSheet.absoluteFill}
          />
        )}
        {!showCamera && imageSource && mode === 'video' && (
          <NativeVideo
            uri={`file://${imageSource}`}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
      <View
        style={[
          styles(theme).row,
          {
            justifyContent: 'space-around',
            alignItems: 'center',
          },
          space(IconSizes.x8).mv,
        ]}>
        {showCamera ? (
          <>
            <IconButton
              Icon={() => (
                <Ionicons
                  name="image-outline"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
              onPress={() => {}}
            />
            <TouchableOpacity
              style={[styles(theme).captureButton]}
              onPress={() => {
                if (mode === 'photo') {
                  takePhoto();
                } else {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }
              }}
              disabled={!isCameraInitialized || !isActive || loading}
            />
            <IconButton
              Icon={() => (
                <Ionicons
                  name="camera-reverse-outline"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
              onPress={() => {
                cameraView === 'back'
                  ? setCameraView('front')
                  : setCameraView('back');
              }}
            />
          </>
        ) : (
          <>
            <IconButton
              Icon={() => (
                <Ionicons
                  name="close"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
              onPress={() => {
                setShowCamera(true);
                setImageSource(null);
              }}
            />
            <IconButton
              Icon={() => (
                <Ionicons
                  name="paper-plane"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.placeholder,
                padding: IconSizes.x7,
                borderRadius: 50,
              }}
              onPress={upPost}
            />
            <IconButton
              Icon={() => (
                <Ionicons
                  name="download"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
              onPress={download}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Camera;
