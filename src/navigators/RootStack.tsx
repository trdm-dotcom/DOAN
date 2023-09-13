import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './AuthStack';
import {MainStack} from './MainStack';
import {useAppDispatch, useAppSelector} from '../reducers/store';
import {HeaderBackButton} from '../components/HeaderBackButton';
import {getAccount} from '../reducers/authentications.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../screens/Loading';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Home: undefined;
  Start: undefined;
  Friend: undefined;
  PhoneNumber: {
    createAccount: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
    mail?: string;
  };
  Mail: {
    createAccount: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
    mail?: string;
  };
  Name: {
    createAccount?: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
    mail?: string;
  };
  Password: {
    createAccount?: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
    mail?: string;
  };
  Otp: {
    createAccount?: boolean;
    name?: string;
    phoneNumber?: string;
    password?: string;
    mail?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAppSelector(
    state => state.authentication.isAuthenticated,
  );

  const checkLoginCredentials = async () => {
    const credentials: string | null = await AsyncStorage.getItem(
      'loginCredentials',
    );
    if (credentials != null) {
      const objCredentials = JSON.parse(credentials);
      const token = objCredentials.token;
      if (token.refExpiredTime > Date.now()) {
        await dispatch(getAccount()).unwrap();
      }
    }
  };

  useEffect(() => {
    checkLoginCredentials().finally(() => {
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Start'}
        screenOptions={{
          header: () => <HeaderBackButton />,
        }}>
        {isAuthenticated ? MainStack(Stack) : AuthStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
