import React, {useContext} from 'react';
import {View} from 'react-native';
import {styles} from '../components/style';
import {AppContext} from '../context';

const Loading = () => {
  const {theme} = useContext(AppContext);
  return <View style={[styles(theme).container, styles(theme).defaultBackground]}></View>;
};

export default Loading;
