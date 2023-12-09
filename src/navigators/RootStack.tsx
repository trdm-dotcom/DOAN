import React, {useContext, useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import NewPassword from '../screens/NewPassword';
import {useNavigation} from '@react-navigation/native';
import EditPost from '../screens/EditPost';
import {getSocket} from '../utils/Socket';
import {Pagination} from '../constants/Constants';
import {apiGet} from '../utils/Api';

export type RootStackParamList = {
  Start: undefined;
  Camera: undefined;
  SignIn: undefined;
  Reset: undefined;
  Main: undefined;
  Chat: undefined;
  SignUp: undefined;
  Setting: undefined;
  MyProfile: undefined;
  Friend: undefined;
  Conversation: {
    targetId: number;
    name: string;
    avatar: string;
  };
  PostView: {
    postId: string;
    userId: number;
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
  EditPost: {
    postId: string;
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
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {isAuthenticated} = useSelector((state: any) => state.user);
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const socket = getSocket();

  useEffect(() => {
    socket.on('show.room', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'updateChats',
          payload: data.data,
        });
      }
    });
    socket.on('delete.room', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'deleteChat',
          payload: data.data,
        });
      }
    });
    socket.on('post.deleteOrDisable', (data: any) => {
      dispatch({
        type: 'deleteOrDisablePost',
        payload: data,
      });
    });
    socket.on('post.reaction', (data: any) => {
      dispatch({
        type: 'updatePostsReactions',
        payload: data,
      });
    });
    socket.on('post.comment', (data: any) => {
      dispatch({
        type: 'updatePostsComments',
        payload: data,
      });
    });
    socket.on('delete.comment', (data: any) => {
      dispatch({
        type: 'deletePostsComments',
        payload: data,
      });
    });
    socket.on('friend.accept', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'addFriend',
          payload: [data.data],
        });
        apiGet<any>('/social/post', {
          params: {
            pageNumber: 0,
            pageSize: Pagination.PAGE_SIZE,
          },
        }).then(res => {
          dispatch({
            type: 'getAllPostsSuccess',
            payload: res,
          });
        });
      }
    });
    socket.on('friend.reject', (data: any) => {
      if (data.to === user.id && data.data.status === 'FRIENDED') {
        dispatch({
          type: 'removeFriendByUserId',
          payload: {
            userId: data.data.userId,
          },
        });
        dispatch({type: 'removePostByUserId', payload: {id: data.data.userId}});
      }
    });
    socket.on('friend.block', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'removeFriendByUserId',
          payload: {
            userId: data.data.userId,
          },
        });
        dispatch({type: 'removePostByUserId', payload: {id: data.data.userId}});
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Start');
    }
  }, [isAuthenticated]);

  return (
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
          <Stack.Screen name="EditPost" component={EditPost} />
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
  );
};

export default RootStack;
