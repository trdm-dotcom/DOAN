import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { colors, styles } from '../components/style';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useIsForeground } from '../reducers/useIsForeground';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { MAX_ZOOM_FACTOR, SCALE_FULL_ZOOM } from '../Constants';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';


const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const Home = () => {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<CameraPermissionStatus>();
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
  const supportsFlash = device?.hasFlash ?? false;
  const zoom = useSharedValue(0);
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);
  const neutralZoom = device?.neutralZoom ?? 1;

  useEffect(() => {
    Camera.getCameraPermissionStatus()
    .then((permission: CameraPermissionStatus) => {
      setCameraPermission(permission);
      console.log(`Camera permission status: ${cameraPermission}`);
      if (permission === 'denied') {
        requestCameraPermission();
      }
    });
    Camera.getMicrophonePermissionStatus()
    .then((permission: CameraPermissionStatus) => {
      setMicrophonePermissionStatus(permission);
      setHasMicrophonePermission(permission === 'authorized');
      console.log(`Microphone permission status: ${microphonePermissionStatus}`);
      if (permission === 'denied') {
        console.log(`Camera permission status: ${permission}`);
        requestMicrophonePermission();
      }
    });
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
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);
    setCameraPermission(permission);
  }, []);

  const moveFriends = () => {
  };

  const moveSetting = () => {
  };

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);


  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <View style={[styles.container]}>
        <View style={[styles.row, styles.spaceBetween, {margin: 20}]}>
          <PressableOpacity style={[styles.buttonDark]} onPress={moveFriends}>
            <IonIcon
              name="people"
              size={32}
              color={colors.white}
            />
          </PressableOpacity>
          <PressableOpacity onPress={moveFriends}>
            <IonIcon
              name="duplicate"
              size={32}
              color={colors.white}
            />
          </PressableOpacity>
          <PressableOpacity style={[styles.buttonDark]} onPress={moveSetting}>
            <IonIcon
              name="person-circle-outline"
              size={32}
              color={colors.white}
            />
          </PressableOpacity>
        </View>
        <View style={[styles.cameraContainer]}>
          {device != null && (
            <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
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
        <View style={[styles.row, styles.spaceBetween, {marginTop: 40, marginBottom: 30, marginHorizontal: 20}]}>
          <PressableOpacity onPress={onFlashPressed} disabled={!supportsFlash}>
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-outline'}
              size={48}
              color={flash === 'on' ? colors.secondary : colors.white}
            />
          </PressableOpacity>
          <PressableOpacity style={styles.camButton} disabled={!isCameraInitialized || !isActive}/>
          <PressableOpacity onPress={onFlipCameraPressed} disabled={!supportsCameraFlipping}>
            <IonIcon
              name="sync"
              size={48}
              color={colors.white}
            />
          </PressableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
