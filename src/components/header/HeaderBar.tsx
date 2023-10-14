import React, {ReactNode} from 'react';
import {View} from 'react-native';

type HeaderBarProps = {
  firstChilden?: ReactNode;
  secondChilden?: ReactNode;
  thirdChilden?: ReactNode;
};

const HeaderBar = ({
  firstChilden,
  secondChilden,
  thirdChilden,
}: HeaderBarProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {firstChilden}
        {secondChilden}
        {thirdChilden}
      </View>
    </View>
  );
};

export default HeaderBar;
