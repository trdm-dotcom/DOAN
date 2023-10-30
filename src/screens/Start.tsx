import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {space, styles} from '../components/style';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  IconSizes,
  SAFE_AREA_PADDING,
  SCREEN_WIDTH,
} from '../constants/Constants';
import {AppContext} from '../context';
import AppButton from '../components/control/AppButton';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const {FontWeights, FontSizes} = Typography;

const Pagination = ({data, x, screenWidth}) => {
  const PaginationComp = ({i}) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const widthAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [10, 20, 10],
        Extrapolate.CLAMP,
      );
      const opacityAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP,
      );
      return {
        width: widthAnimation,
        opacity: opacityAnimation,
      };
    });
    return (
      <Animated.View
        style={[
          {
            height: 10,
            backgroundColor: ThemeStatic.accent,
            marginHorizontal: 10,
            borderRadius: 5,
          },
          animatedDotStyle,
        ]}
      />
    );
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      {data.map((_, i) => {
        return <PaginationComp i={i} key={i} />;
      })}
    </View>
  );
};

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const data = [
    {
      id: 1,
      image: require('../../assets/image1.png'),
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 2,
      image: require('../../assets/image2.png'),
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 3,
      image: require('../../assets/image3.png'),
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const onViewableItemsChanged = ({viewableItems}) => {
    flatListIndex.value = viewableItems[0].index;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const RenderItem = ({item, index}) => {
    const imageAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP,
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        transform: [{translateY: translateYAnimation}],
      };
    });
    const textAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP,
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP,
      );

      return {
        opacity: opacityAnimation,
        transform: [{translateY: translateYAnimation}],
      };
    });
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
          },
          {width: SCREEN_WIDTH},
        ]}>
        <Animated.Image source={item.image} style={imageAnimationStyle} />
        <Animated.View style={textAnimationStyle}>
          <Text
            style={{
              ...FontWeights.Bold,
              ...FontSizes.Heading,
              textAlign: 'center',
              marginBottom: 10,
              color: theme.text01,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              ...FontWeights.Bold,
              ...FontSizes.Body,
              textAlign: 'center',
              marginHorizontal: 35,
              color: theme.text02,
            }}>
            {item.text}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View
      style={[
        {flex: 1, paddingVertical: SAFE_AREA_PADDING.paddingVertical},
        styles(theme).defaultBackground,
      ]}>
      <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        style={[{flex: 1}]}>
        <Animated.FlatList
          onScroll={onScroll}
          data={data}
          renderItem={({item, index}) => {
            return <RenderItem item={item} index={index} />;
          }}
          keyExtractor={item => item.id.toString()}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 20,
              paddingVertical: 20,
            },
          ]}>
          <Pagination data={data} x={x} screenWidth={SCREEN_WIDTH} />
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(400).duration(1000).springify()}
        style={[
          {
            justifyContent: 'flex-end',
            paddingHorizontal: SAFE_AREA_PADDING.paddingHorizontal,
          },
          space(IconSizes.x5).mt,
        ]}>
        <AppButton
          label="Create account"
          loading={false}
          onPress={() => navigation.navigate('SignUp')}
          containerStyle={[
            styles(theme).button,
            styles(theme).buttonPrimary,
            space(IconSizes.x4).mb,
          ]}
          labelStyle={{
            ...FontWeights.Bold,
            ...FontSizes.Body,
            color: ThemeStatic.white,
          }}
        />
        <AppButton
          label="Sign in"
          loading={false}
          onPress={() => navigation.navigate('SignIn')}
          containerStyle={[styles(theme).button]}
          labelStyle={{
            ...FontWeights.Bold,
            ...FontSizes.Body,
            color: theme.text01,
          }}
        />
      </Animated.View>
    </View>
  );
};

export default Start;
