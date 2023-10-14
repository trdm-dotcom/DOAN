import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {useContext} from 'react';
import {styles} from '../components/style';
import {TouchableOpacity, View} from 'react-native';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';

type props = NativeStackScreenProps<RootStackParamList, 'Photo'>;

const Photo = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {photo} = route.params;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
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
                size={IconSizes.x8}
                color={theme.text01}
              />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
};

export default Photo;
