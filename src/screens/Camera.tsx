import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  CameraDevices,
  Camera as CameraVision,
  PhotoFile,
  // VideoFile,
  useCameraDevices,
} from 'react-native-vision-camera';
import {AppContext} from '../context';
import {
  Linking,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from '../hook/useIsForeground';
import IconButton from '../components/control/IconButton';
import {NativeImage} from '../components/shared/NativeImage';
import {NativeVideo} from '../components/shared/NativeVideo';
import Header from '../components/header/Header';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import Typography from '../theme/Typography';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {getHash} from '../utils/Crypto';
import {upPost} from '../reducers/action/post';
import {IParam} from 'src/models/IParam';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;
const Camera = ({navigation}: props) => {
  const {theme, cameraView, toggleCameraView} = useContext(AppContext);
  const devices: CameraDevices = useCameraDevices();
  const cameraRef = useRef<CameraVision>(null);
  const [torch, setTorch] = useState<'on' | 'off' | 'auto'>('off');
  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  // const [isRecording, setIsRecording] = useState(false);
  const [caption, setCaption] = useState<any>(null);
  const device = cameraView === 'back' ? devices.back : devices.front;

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;
  const inputCaptionRef = useRef<TextInput>(null);

  useEffect(() => {
    cameraPermission();
  }, [devices]);

  const cameraPermission = useCallback(async () => {
    const permission = await CameraVision.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, [devices]);

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

  // const startRecording = async () => {
  //   try {
  //     if (cameraRef.current != null) {
  //       await cameraRef.current.startRecording({
  //         flash: `${torch}`,
  //         onRecordingFinished: (file: VideoFile) => {
  //           setImageSource(file.path);
  //         },
  //         onRecordingError: (error: any) => {
  //           console.warn(error);
  //         },
  //       });
  //     }
  //   } finally {
  //     setIsRecording(true);
  //   }
  // };

  // const stopRecording = async () => {
  //   try {
  //     if (cameraRef.current != null) {
  //       await cameraRef.current.stopRecording();
  //     }
  //   } finally {
  //     setIsRecording(false);
  //   }
  // };

  const doUpPost = async () => {
    try {
      const source = await uploadImage(imageSource);
      const body: IParam = {
        source: source,
        caption: caption,
        hash: getHash('UP_POST'),
      };
      await upPost(body);
      setShowCamera(true);
      setCaption(null);
      setImageSource(null);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {};

  const openGallery = () => {
    launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      quality: 1,
    }).then(result => {
      if (result && result.assets) {
        setMode('photo');
        setImageSource(result.assets[0].uri);
        setShowCamera(false);
      }
    });
  };

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const imageRef = storage().ref(filename);
    await imageRef.putFile(uploadUri);
    return imageRef.getDownloadURL();
  };

  const onCameraInitialized = useCallback(
    () => console.log('camera initialized'),
    [],
  );

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
          <IconButton
            Icon={() => (
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            )}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <View
        style={[
          styles(theme).row,
          {
            justifyContent: 'space-between',
          },
        ]}>
        {!showCamera && (
          <>
            <Header title="Send to..." />
          </>
        )}
      </View>
      {device && showCamera && (
        <View style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}>
          <CameraVision
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo
            enableZoomGesture
            orientation="portrait"
            onInitialized={onCameraInitialized}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: IconSizes.x4,
            }}>
            {/* <IconButton
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
            /> */}
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
        </View>
      )}
      {!showCamera && (
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={20}
          style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}>
          {mode === 'photo' && (
            <>
              <NativeImage
                uri={`file://${imageSource}`}
                style={StyleSheet.absoluteFill}
              />
            </>
          )}
          {mode === 'video' && (
            <>
              <NativeVideo
                uri={`file://${imageSource}`}
                style={StyleSheet.absoluteFill}
              />
            </>
          )}
          <TextInput
            onChangeText={(text: string) => {
              if (text && text.trim().length > 0) {
                setCaption(text.trim());
              }
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
                flex: 1,
              },
            ]}
            ref={inputCaptionRef}
            autoFocus
            placeholder="Add a caption..."
            placeholderTextColor={theme.text02}
          />
        </KeyboardAvoidingView>
      )}
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
              onPress={() => openGallery()}
            />
            <TouchableOpacity
              style={[styles(theme).captureButton]}
              onPress={() => {
                if (mode === 'photo') {
                  takePhoto();
                }
                // else {
                //   if (isRecording) {
                //     stopRecording();
                //   } else {
                //     startRecording();
                //   }
                // }
              }}
              disabled={!isActive || loading}
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
                  ? toggleCameraView('front')
                  : toggleCameraView('back');
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
              onPress={doUpPost}
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
