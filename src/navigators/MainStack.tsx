import React from 'react';
import Otp from '../screens/Otp';
import Feed from '../screens/Feed';
import Camera from '../screens/Camera';
import Name from '../screens/Name';
import Photo from '../screens/Photo';
import Notification from '../screens/Notification';

export const MainStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Name" component={Name} />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen name="Notification" component={Notification} />
    </>
  );
};
