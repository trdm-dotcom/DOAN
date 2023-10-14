import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './AuthStack';
import {MainStack} from './MainStack';
import {useAppSelector} from '../reducers/redux/store';
import {PhotoFile} from 'react-native-vision-camera';

export type RootStackParamList = {
  Feed: undefined;
  Start: undefined;
  Camera: undefined;
  Setting: undefined;
  Name: undefined;
  PhoneNumber: undefined;
  SignIn: undefined;
  Notification: undefined;
  Photo: {photo: PhotoFile};
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
