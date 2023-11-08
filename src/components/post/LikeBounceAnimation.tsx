import React, {useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {ThemeStatic} from '../../theme/Colors';
import {IconSizes} from '../../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const AnimationValues = {
  opacity: {initial: 0, final: 1},
  bounce: {initial: 0.4, final: 1},
};

interface LikeBounceAnimationProps {
  ref: React.Ref<any>;
}

const LikeBounceAnimation: React.FC<LikeBounceAnimationProps> =
  React.forwardRef((_, ref) => {
    const [animating, setAnimating] = useState(false);
    const [likeOpacity] = useState(
      new Animated.Value(AnimationValues.opacity.initial),
    );
    const [likeBounce] = useState(
      new Animated.Value(AnimationValues.bounce.initial),
    );

    // @ts-ignore
    ref.current = {
      animate: () => {
        if (animating) {
          return;
        }

        const opacityConfig = {
          duration: 250,
          useNativeDriver: true,
        };

        const fadeInConfig = {
          toValue: AnimationValues.opacity.final,
          ...opacityConfig,
        };

        const fadeOutConfig = {
          toValue: AnimationValues.opacity.initial,
          ...opacityConfig,
        };

        const springConfig = {
          toValue: AnimationValues.bounce.final,
          friction: 2,
          useNativeDriver: true,
        };

        setAnimating(true);

        const parallelAnimations = [
          Animated.spring(likeBounce, springConfig),
          Animated.timing(likeOpacity, fadeInConfig),
        ];

        Animated.parallel(parallelAnimations).start(() => {
          Animated.timing(likeOpacity, fadeOutConfig).start(() => {
            likeBounce.setValue(AnimationValues.bounce.initial);
            setAnimating(false);
          });
        });
      },
    };

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: likeOpacity,
            transform: [{scale: likeBounce}],
          },
        ]}>
        <Ionicons name="heart" color={ThemeStatic.like} size={IconSizes.x12} />
      </Animated.View>
    );
  });

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: responsiveWidth(75) / 2.25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LikeBounceAnimation;
