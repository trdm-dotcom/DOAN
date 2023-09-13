import React from 'react';
import Home from '../screens/Home';
import Otp from '../screens/Otp';
import Friend from '../screens/Friend';

export const MainStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Friend"
        component={Friend}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Otp" component={Otp} />
    </>
  );
};
