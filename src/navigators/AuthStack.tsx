import React from 'react';
import Name from '../screens/Name';
import Otp from '../screens/Otp';
import Password from '../screens/Password';
import PhoneNumber from '../screens/PhoneNumber';
import Start from '../screens/Start';
import Mail from '../screens/Mail';

export const AuthStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Mail" component={Mail} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Name" component={Name} />
      <Stack.Screen name="Otp" component={Otp} />
    </>
  );
};
