import React from 'react';
import Otp from '../screens/Otp';
import Password from '../screens/Password';
import PhoneNumber from '../screens/PhoneNumber';
import Start from '../screens/Start';
import Mail from '../screens/Mail';
import SignIn from '../screens/SignIn';
import Reset from '../screens/Reset';

export const AuthStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Mail" component={Mail} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Reset" component={Reset} />
    </>
  );
};
