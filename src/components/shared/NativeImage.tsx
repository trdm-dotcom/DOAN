import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

type NativeImageProps = {
  uri: string;
  style: any;
};

export const NativeImage = ({uri, style}: NativeImageProps) => {
  if (!uri) {
    return <View style={style} />;
  }
  return (
    <FastImage
      style={style}
      source={{uri, priority: FastImage.priority.normal}}
    />
  );
};
