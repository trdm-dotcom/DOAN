import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './AuthStack';
import {MainStack} from './MainStack';
import {useAppSelector} from '../reducers/redux/store';

export type RootStackParamList = {
  Feed: undefined;
  Start: undefined;
  Friend: undefined;
  Camera: undefined;
  Setting: undefined;
  Name: undefined;
  PhoneNumber: undefined;
  SignIn: undefined;
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
    createAccount: boolean;
    phoneNumber?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Friend' : 'Start'}
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? MainStack(Stack) : AuthStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
