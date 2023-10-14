import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {AppContext} from '../context';
import Typography from '../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Feed'>;

const Feed = ({}: props) => {
  const {theme} = useContext(AppContext);
  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <Text
        style={[
          {
            ...FontWeights.Bold,
            ...FontSizes.Body,
          },
        ]}>
        Feed
      </Text>
    </View>
  );
};

export default Feed;