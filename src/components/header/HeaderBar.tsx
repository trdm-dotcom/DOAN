import React, {ReactNode, useContext} from 'react';
import {StyleProp, Text, TextStyle, View} from 'react-native';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';

const {FontWeights, FontSizes} = Typography;

type HeaderBarProps = {
  contentLeft?: ReactNode;
  title?: string;
  onTitlePress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  contentRight?: ReactNode;
};

const HeaderBar = ({
  contentLeft,
  title,
  onTitlePress,
  titleStyle,
  contentRight,
}: HeaderBarProps) => {
  const {theme} = useContext(AppContext);

  return (
    <View
      style={{
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {contentLeft}
          {title && (
            <Text
              onPress={onTitlePress}
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Label,
                  color: theme.text01,
                  marginLeft: 10,
                },
                titleStyle,
              ]}>
              {title}
            </Text>
          )}
        </View>
        {contentRight}
      </View>
    </View>
  );
};

export default HeaderBar;
