/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {DotIndicator} from 'react-native-indicators';

interface LoadingIndicatorProps {
  size: number;
  color?: string;
  count?: number;
}

const LoadingIndicator = ({size, color, count}: LoadingIndicatorProps) => (
  <DotIndicator size={size} color={color} count={count || 3} />
);

export default LoadingIndicator;
