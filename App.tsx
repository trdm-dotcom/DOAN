import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import PhoneNumber from './src/screens/PhoneNumber';
import Password from './src/screens/Password';
import Name from './src/screens/Name';

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Name"
          component={Name}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PhoneNumber"
          component={PhoneNumber}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Password"
          component={Password}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
