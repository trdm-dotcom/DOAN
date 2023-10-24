import React, {useState, useRef} from 'react';
import {Animated, PanResponder, View} from 'react-native';

type BounceViewProps = {
  onPress: () => void;
  scale: number;
  moveSlop: number;
  delay: number;
  children?: React.ReactNode;
  style?: any;
  rest?: any;
};

const BounceView = ({
  onPress,
  scale,
  moveSlop,
  delay,
  children,
  style,
  rest,
}: BounceViewProps) => {
  const [animatedScale] = useState(new Animated.Value(1));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {},
      onPanResponderGrant: () => {
        Animated.timing(animatedScale, {
          toValue: scale,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: (evt, gestureState) => {
        const isOutOfRange =
          gestureState.dy > moveSlop ||
          gestureState.dy < -moveSlop ||
          gestureState.dx > moveSlop ||
          gestureState.dx < -moveSlop;

        if (!isOutOfRange) {
          setTimeout(() => {
            Animated.spring(animatedScale, {
              toValue: 1,
              friction: 1,
              useNativeDriver: true,
            }).start();
            onPress();
          }, delay);
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        {
          transform: [{scale: animatedScale}],
        },
        style,
      ]}
      {...rest}>
      <View {...panResponder.panHandlers}>{children}</View>
    </Animated.View>
  );
};

export default BounceView;
