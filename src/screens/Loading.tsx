import React, {useContext} from 'react';
import {View} from 'react-native';
import {styles} from '../components/style';
import {AppContext} from '../context';

const Loading = () => {
  const {theme} = useContext(AppContext);
  return <View style={[styles(theme).container]}></View>;
};

export default Loading;
