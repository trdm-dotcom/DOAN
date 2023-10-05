/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../components/style';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CONTENT_SPACING} from '../constants/Constants';
import {AppContext} from '../context';
import AppButton from '../components/control/AppButton';
import Typography from '../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View style={[styles(theme).displayBottom, styles(theme).fullWidth]}>
        <AppButton
          label="Create account"
          loading={false}
          onPress={() => navigation.navigate('PhoneNumber')}
          containerStyle={[
            styles(theme).buttonPrimary,
            {marginBottom: CONTENT_SPACING},
          ]}
          labelStyle={{
            ...FontWeights.Bold,
            ...FontSizes.Body,
          }}
        />
        <AppButton
          label="Sign in"
          loading={false}
          onPress={() => navigation.navigate('SignIn')}
          containerStyle={[styles(theme).buttonSecondary]}
          labelStyle={{
            ...FontWeights.Bold,
            ...FontSizes.Body,
          }}
        />
      </View>
    </View>
  );
};

export default Start;
