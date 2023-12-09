import React, {useContext} from 'react';
import {View} from 'react-native';
import {space, styles} from '../components/style';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IconSizes, SAFE_AREA_PADDING} from '../constants/Constants';
import {AppContext} from '../context';
import AppButton from '../components/control/AppButton';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';
import Animated, {FadeInDown} from 'react-native-reanimated';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation}: props) => {
  const {theme} = useContext(AppContext);

  return (
    <View
      style={[
        {flex: 1, paddingVertical: SAFE_AREA_PADDING.paddingVertical},
        styles(theme).defaultBackground,
      ]}>
      <View style={[{flex: 1}]} />
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
