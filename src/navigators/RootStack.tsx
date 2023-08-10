import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import { useAppSelector } from '../reducers/store';

export type RootStackParamList = {
  Home: undefined;
  Start: undefined;
  PhoneNumber: {
    createAccount: boolean;
  };
  Name: {
    createAccount?: boolean;
    phoneNumber?: string;
  };
  Password: {
    createAccount?: boolean;
    name?: string;
    phoneNumber?: string;
  };
  Otp: {
    createAccount?: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { isAuthenticated ? MainStack(Stack) : AuthStack(Stack) }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
