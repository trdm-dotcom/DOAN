import React from 'react';
import Name from '../screens/Name';
import Otp from '../screens/Otp';
import Password from '../screens/Password';
import PhoneNumber from '../screens/PhoneNumber';
import Start from '../screens/Start';

export const AuthStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen
        name="Start"
        component={Start}
      />
      <Stack.Screen
        name="PhoneNumber"
        component={PhoneNumber}
      />
      <Stack.Screen
        name="Password"
        component={Password}
      />
      <Stack.Screen
        name="Name"
        component={Name}
      />
      <Stack.Screen
        name="Otp"
        component={Otp}
      />
    </>
  );
};
