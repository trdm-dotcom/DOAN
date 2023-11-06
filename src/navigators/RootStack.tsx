import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Feed from '../screens/Feed';
import Camera from '../screens/Camera';
import Otp from '../screens/Otp';
import Friend from '../screens/Friend';
import Notifi from '../screens/Notifi';
import Setting from '../screens/Setting';
import Start from '../screens/Start';
import Password from '../screens/Password';
import SignIn from '../screens/SignIn';
import Reset from '../screens/Reset';
import PostView from '../screens/PostView';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppContext} from '../context';
import Feather from 'react-native-vector-icons/Feather';
import Chat from '../screens/Chat';
import Conversation from '../screens/Conversation';
import SignUp from '../screens/SignUp';
import {ThemeStatic} from '../theme/Colors';
import Profile from '../screens/Profile';
import MyProfile from '../screens/MyProfile';
import {useSelector} from 'react-redux';
import NewPassword from '../screens/NewPassword';

export type RootStackParamList = {
  Start: undefined;
  Camera: undefined;
  SignIn: undefined;
  Reset: undefined;
  Main: undefined;
  Chat: undefined;
  SignUp: undefined;
  Setting: undefined;
  Conversation: {
    chatId: string;
    targetId: number;
    name: string;
    avatar: string;
  };
  PostView: {
    postId: string;
  };
  Profile: {userId: number};
  NewPassword: {
    mail: string;
    otpKey: string;
  };
  Password: {
    name: string;
    phoneNumber: string;
    mail: string;
    otpKey: string;
  };
  Otp: {
    mail: string;
    otpId: string;
    nextStep: keyof RootStackParamList;
    name?: string;
    phoneNumber?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const RootStack = () => {
  const {isAuthenticated} = useSelector((state: any) => state.user);
  const {theme} = useContext(AppContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Main' : 'Start'}
        screenOptions={{headerShown: false, animation: 'fade'}}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main">
              {() => (
                <Tab.Navigator
                  screenOptions={({route}) => ({
                    initialRouteName: 'Feed',
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: {
                      backgroundColor: theme.base,
                      height: 60,
                    },
                    tabBarIcon: ({focused, color, size}) => {
                      let iconName;
                      if (route.name === 'Feed') {
                        iconName = 'home';
                      } else if (route.name === 'Notifi') {
                        iconName = 'bell';
                      } else if (route.name === 'Friend') {
                        iconName = 'users';
                      } else if (route.name === 'MyProfile') {
                        iconName = 'user';
                      }
                      color = focused ? ThemeStatic.accent : theme.text01;
                      // You can return any component that you like here!
                      return (
                        <Feather name={iconName} size={size} color={color} />
                      );
                    },
                  })}>
                  <Tab.Screen name="Feed" component={Feed} />
                  <Tab.Screen name="Notifi" component={Notifi} />
                  <Tab.Screen name="Friend" component={Friend} />
                  <Tab.Screen name="MyProfile" component={MyProfile} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="PostView" component={PostView} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Conversation" component={Conversation} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Setting" component={Setting} />
          </>
        ) : (
          <>
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Password" component={Password} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Reset" component={Reset} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
