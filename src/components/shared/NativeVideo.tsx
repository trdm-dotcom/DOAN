import React from 'react';
import {View} from 'react-native';
import Video from 'react-native-video';

type NativeVideoProps = {
  uri: string;
  style: any;
};

export const NativeVideo = ({uri, style}: NativeVideoProps) => {
  if (!uri) {
    return <View style={style} />;
  }
  return <Video style={style} source={{uri: uri}} />;
};
