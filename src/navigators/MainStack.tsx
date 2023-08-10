import React from 'react';
import Home from '../screens/Home';
import Otp from '../screens/Otp';

export const MainStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="Otp"
        component={Otp}
      />
    </>
  );
};