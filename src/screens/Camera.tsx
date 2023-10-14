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
  useCameraDevices,
} from 'react-native-vision-camera';
import {AppContext} from '../context';
import {Linking, TouchableOpacity, View, StyleSheet} from 'react-native';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  IconSizes,
  MAX_ZOOM_FACTOR,
  SCALE_FULL_ZOOM,
} from '../constants/Constants';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from '../hook/useIsForeground';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import SettingsBottomSheet from '../components/bottomsheet/SettingsBottomSheet';
import FriendBottomSheet from '../components/bottomsheet/FriendBottomSheet';
import BlockListBottomSheet from '../components/bottomsheet/BlockListBottomSheet';
import {Modalize} from 'react-native-modalize';

const ReanimatedCamera = Reanimated.createAnimatedComponent(CameraVision);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const Camera = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const cameraRef = useRef<CameraVision>(null);
  const settingsBottomSheetRef = useRef<Modalize>(null);
  const friendBottomSheetRef = useRef<Modalize>(null);
  const blockListBottomSheetRef = useRef<Modalize>(null);

  // @ts-ignore
  const onSettingsOpen = () => settingsBottomSheetRef.current?.open();
  // @ts-ignore
  const onSettingsClose = () => settingsBottomSheetRef.current?.close();
  // @ts-ignore
  const onFriendOpen = () => friendBottomSheetRef.current?.open();
  // @ts-ignore
  const onFriendClose = () => friendBottomSheetRef.current?.close();
  // @ts-ignore
  const onBlockListOpen = () => blockListBottomSheetRef.current?.open();

  const onBlockListPress = () => {
    onSettingsClose();
    onBlockListOpen();
  };

  const onAboutPress = () => {
    onSettingsClose();
  };

  const onUserPress = () => {
    onFriendClose();
  };

  const [flashToggle, setFlashToggle] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState('back');
  const [torch, setTorch] = useState<'on' | 'off' | 'auto'>('off');
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  const devices: CameraDevices = useCameraDevices();
  const device = cameraView === 'back' ? devices.back : devices.front;
  const zoom = useSharedValue(0);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const cameraPermission = useCallback(async () => {
    const permission = await CameraVision.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    const microMicrophonePermission =
      await CameraVision.requestMicrophonePermission();
    if (microMicrophonePermission === 'denied') {
      await Linking.openSettings();
    }
    setHasMicrophonePermission(microMicrophonePermission === 'authorized');
  }, [devices]);

  useEffect(() => {
    cameraPermission();
  }, [cameraPermission, devices]);

  const takePhoto = async () => {
    try {
      if (cameraRef.current == null) {
        throw new Error('Camera Ref is Null');
      }
      const photo: PhotoFile = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
        flash: `${torch}`,
        enableAutoRedEyeReduction: true,
        enableAutoStabilization: true,
        skipMetadata: true,
      });
      navigation.navigate('Photo', {photo: photo});
    } catch (err: any) {
      console.log(err);
    }
  };

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View
        style={[
          styles(theme).row,
          {
            justifyContent: 'space-between',
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            onFriendOpen();
          }}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              padding: IconSizes.x1,
              borderRadius: 50,
            },
          ]}>
          <Ionicons
            name="people-circle-outline"
            size={IconSizes.x8}
            color={theme.text01}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSettingsOpen();
          }}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              padding: IconSizes.x1,
              borderRadius: 50,
            },
          ]}>
          <Ionicons
            name="person-circle-outline"
            size={IconSizes.x8}
            color={theme.text01}
          />
        </TouchableOpacity>
      </View>
      {device != null && (
        <GestureHandlerRootView style={[space(IconSizes.x8).mt]}>
          <View style={[styles(theme).cameraContainer]}>
            <PinchGestureHandler
              onGestureEvent={onPinchGesture}
              enabled={isActive}>
              <Reanimated.View style={StyleSheet.absoluteFill}>
                <ReanimatedCamera
                  ref={cameraRef}
                  device={device}
                  isActive={isActive}
                  animatedProps={cameraAnimatedProps}
                  photo={true}
                  video={true}
                  audio={hasMicrophonePermission}
                  onInitialized={onInitialized}
                  orientation="portrait"
                />
              </Reanimated.View>
            </PinchGestureHandler>
          </View>
        </GestureHandlerRootView>
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
        <TouchableOpacity
          onPress={() => {
            setFlashToggle(!flashToggle);
            torch === 'off' ? setTorch('on') : setTorch('off');
          }}
          disabled={!isCameraInitialized || !isActive}>
          <Ionicons
            name={torch === 'on' ? 'flash' : 'flash-outline'}
            size={IconSizes.x9}
            color={torch === 'on' ? theme.accent : theme.text01}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles(theme).captureButton]}
          onPress={takePhoto}
          disabled={!isCameraInitialized || !isActive}
        />
        <TouchableOpacity
          onPress={() => {
            cameraView === 'back'
              ? setCameraView('front')
              : setCameraView('back');
          }}
          disabled={!isCameraInitialized || !isActive}>
          <Ionicons name="sync" size={IconSizes.x9} color={theme.text01} />
        </TouchableOpacity>
      </View>
      {/* <FriendBottomSheet ref={friendBottomSheetRef} onUserPress={onUserPress} /> */}
      {/* <SettingsBottomSheet
        ref={settingsBottomSheetRef}
        onBlockListPress={onBlockListPress}
        onAboutPress={onAboutPress}
      />
      <BlockListBottomSheet ref={blockListBottomSheetRef} /> */}
    </View>
  );
};

export default Camera;
