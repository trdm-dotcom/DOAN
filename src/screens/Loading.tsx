import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {styles} from '../components/style';
import {AppContext} from '../context';
import Typography from '../theme/Typography';
import Group from '../../assets/svg/Group.svg';
import Ellipse8 from '../../assets/svg/Ellipse8.svg';
import Ellipse9 from '../../assets/svg/Ellipse9.svg';
import Ellipse10 from '../../assets/svg/Ellipse10.svg';
import Ellipse11 from '../../assets/svg/Ellipse11.svg';
import Ellipse12 from '../../assets/svg/Ellipse12.svg';
import Ellipse13 from '../../assets/svg/Ellipse13.svg';
import {IconSizes, SAFE_AREA_PADDING} from '../constants/Constants';

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
        <Group
          style={{
            width: 12,
            height: 12,
            flexShrink: 0,
          }}
          fill={theme.text01}
        />
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
      <Ellipse8
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 199,
          left: SAFE_AREA_PADDING.paddingLeft + 83,
          width: 31,
          height: 31,
          flexShrink: 0,
        }}
      />
      <Ellipse9
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 547,
          left: SAFE_AREA_PADDING.paddingLeft + 293,
          width: 31,
          height: 31,
          flexShrink: 0,
        }}
      />
      <Ellipse10
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 660,
          left: SAFE_AREA_PADDING.paddingLeft + 83,
          width: 31,
          height: 31,
          flexShrink: 0,
        }}
      />
      <Ellipse11
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 121,
          left: SAFE_AREA_PADDING.paddingLeft + 261,
          width: 49,
          height: 49,
          flexShrink: 0,
        }}
      />
      <Ellipse12
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 388,
          left: SAFE_AREA_PADDING.paddingLeft + 34,
          width: 49,
          height: 49,
          flexShrink: 0,
        }}
      />
      <Ellipse13
        style={{
          position: 'absolute',
          top: SAFE_AREA_PADDING.paddingTop + 452,
          left: SAFE_AREA_PADDING.paddingLeft + 261,
          width: 49,
          height: 49,
          flexShrink: 0,
        }}
      />
    </View>
  );
};

export default Loading;
