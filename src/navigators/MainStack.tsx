import React from 'react';
import Otp from '../screens/Otp';
import Friend from '../screens/Friend';
import Feed from '../screens/Feed';
import Camera from '../screens/Camera';
import Setting from '../screens/Setting';
import Name from '../screens/Name';

export const MainStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen name="Friend" component={Friend} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Name" component={Name} />
    </>
  );
};
