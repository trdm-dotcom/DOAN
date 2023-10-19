import React from 'react';
import Otp from '../screens/Otp';
import Feed from '../screens/Feed';
import Camera from '../screens/Camera';
import Notification from '../screens/Notification';
import Friend from '../screens/Friend';
import Setting from '../screens/Setting';

export const MainStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Friend" component={Friend} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Setting" component={Setting} />
    </>
  );
};
