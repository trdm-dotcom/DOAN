/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import IconButton from '../components/control/IconButton';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Setting'>;

const Setting = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);

  return (
    <>
      <View style={{height: 24}}>
        <HeaderBar
          firstChilden={
            <IconButton
              Icon={() => (
                <Ionicons
                  name="chevron-back-outline"
                  size={IconSizes.x6}
                  color={theme.text01}
                />
              )}
              onPress={() => navigation.goBack()}
            />
          }
        />
      </View>
      <View style={[styles(theme).container]}>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Body,
            },
          ]}>
          Setting
        </Text>
      </View>
    </>
  );
};

export default Setting;
