import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './AuthStack';
import {MainStack} from './MainStack';
import {useAppSelector} from '../reducers/redux/store';

export type RootStackParamList = {
  Feed: undefined;
  Start: undefined;
  Camera: undefined;
  Setting: undefined;
  PhoneNumber: undefined;
  SignIn: undefined;
  Notification: undefined;
  Friend: undefined;
  Reset: undefined;
  NewPassword: {
    username: string;
    otpKey: string;
  };
  Profile: {userId: number};
  Mail: {
    phoneNumber: string;
    otpKey: string;
  };
  Password: {
    name: string;
    phoneNumber: string;
    mail: string;
    otpKey: string;
  };
  Otp: {
    phoneNumber: string;
    otpId: string;
    nextStep: keyof RootStackParamList;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Camera' : 'Start'}
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? MainStack(Stack) : AuthStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
