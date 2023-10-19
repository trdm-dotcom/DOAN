import React, {useContext} from 'react';
import {View} from 'react-native';
import {space, styles} from '../components/style';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IconSizes} from '../constants/Constants';
import {AppContext} from '../context';
import AppButton from '../components/control/AppButton';
import Typography from '../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation}: props) => {
  const {theme} = useContext(AppContext);

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View style={[{flex: 1}]}>
        <View style={[styles(theme).displayBottom, styles(theme).fullWidth]}>
          <AppButton
            label="Create account"
            loading={false}
            onPress={() => navigation.navigate('PhoneNumber')}
            containerStyle={[
              styles(theme).button,
              styles(theme).buttonPrimary,
              space(IconSizes.x4).mb,
              {flex: 1},
            ]}
            labelStyle={{
              ...FontWeights.Bold,
              ...FontSizes.Body,
              color: theme.text01,
            }}
          />
          <AppButton
            label="Sign in"
            loading={false}
            onPress={() => navigation.navigate('SignIn')}
            containerStyle={[
              styles(theme).button,
              styles(theme).buttonSecondary,
              {flex: 1},
            ]}
            labelStyle={{
              ...FontWeights.Bold,
              ...FontSizes.Body,
              color: theme.text01,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Start;
