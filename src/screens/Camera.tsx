/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Camera as CameraVision,
  CameraPermissionStatus,
  useCameraDevices,
  CameraPermissionRequestResult,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
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
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';

const ReanimatedCamera = Reanimated.createAnimatedComponent(CameraVision);

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const Camera = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const camera = useRef<CameraVision>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>();
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const isFocussed = useIsFocused();
  const isActive = isFocussed;
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;
  const zoom = useSharedValue(0);
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);
  const neutralZoom = device?.neutralZoom ?? 1;

  useEffect(() => {
    const requestPermission = async () => {
      const cameraPermissionStatus: CameraPermissionStatus =
        await CameraVision.getCameraPermissionStatus();
      setCameraPermission(cameraPermissionStatus);
      console.log(`Camera permission status: ${cameraPermissionStatus}`);
      if (cameraPermissionStatus !== 'authorized') {
        requestCameraPermission();
      }

      const microphonePermissionStatus: CameraPermissionStatus =
        await CameraVision.getCameraPermissionStatus();
      setMicrophonePermission(microphonePermissionStatus);
      setHasMicrophonePermission(microphonePermissionStatus === 'authorized');
      console.log(`Microphone permission status: ${microphonePermission}`);
      if (microphonePermissionStatus === 'not-determined') {
        console.log(`Camera permission status: ${microphonePermissionStatus}`);
        requestMicrophonePermission();
      }
    };

    requestPermission();
  }, []);

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

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    console.log('Requesting microphone permission...');
    const permission: CameraPermissionRequestResult =
      await CameraVision.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setMicrophonePermission(permission);
    setHasMicrophonePermission(permission === 'authorized');
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission: CameraPermissionRequestResult =
      await CameraVision.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermission(permission);
  }, []);

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

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
    <>
      <View style={{height: 24}}>
        <HeaderBar
          firstChilden={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x6}
                color={theme.text01}
              />
            </TouchableOpacity>
          }
        />
      </View>
      <GestureHandlerRootView style={[styles(theme).container]}>
        <View style={[styles(theme).cameraContainer, styles(theme).mt20]}>
          {device != null && (
            <PinchGestureHandler
              onGestureEvent={onPinchGesture}
              enabled={isActive}>
              <Reanimated.View style={StyleSheet.absoluteFill}>
                <ReanimatedCamera
                  ref={camera}
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
          )}
        </View>
        <View
          style={[
            styles(theme).row,
            styles(theme).spaceBetween,
            {marginTop: 40, marginBottom: 30, marginHorizontal: 20},
          ]}>
          <TouchableOpacity onPress={onFlashPressed} disabled={!supportsFlash}>
            <Ionicons
              name="flash-outline"
              size={IconSizes.x9}
              color={flash === 'on' ? theme.accent : theme.text01}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(theme).camButton}
            disabled={!isCameraInitialized || !isActive}
          />
          <TouchableOpacity
            onPress={onFlipCameraPressed}
            disabled={!supportsCameraFlipping}>
            <Ionicons name="sync" size={IconSizes.x9} color={theme.text01} />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </>
  );
};

export default Camera;
