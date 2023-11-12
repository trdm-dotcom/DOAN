import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {styles} from '../components/style';
import {AppContext} from '../context';
import Typography from '../theme/Typography';
import {IconSizes} from '../constants/Constants';

const {FontWeights} = Typography;

const Loading = () => {
  const {theme} = useContext(AppContext);
  return (
    <View
      style={[
        styles(theme).container,
        styles(theme).defaultBackground,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <View
        style={{
          width: 132,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            ...FontWeights.Bold,
            fontSize: IconSizes.x10,
            color: theme.text01,
            fontFamily: 'Sniglet-Regular',
            marginLeft: IconSizes.x1,
          }}>
          Fotei
        </Text>
      </View>
    </View>
  );
};

export default Loading;
