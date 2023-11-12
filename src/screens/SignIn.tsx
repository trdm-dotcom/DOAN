import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {space, styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBar from '../components/header/HeaderBar';
import {AppContext} from '../context';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {CONTENT_SPACING, IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import {password as loginPassword} from '../reducers/action/authentications';
import {ILoginRequest} from '../models/request/ILoginRequest.model';
import {getHash} from '../utils/Crypto';
import IconButton from '../components/control/IconButton';
import Header from '../components/header/Header';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {getUserInfo} from '../reducers/action/user';
import {ThemeStatic} from '../theme/Colors';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {getNotificationSetting} from '../reducers/action/notification';
import {CLIENT_SECRET} from '@env';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: props) => {
  const dispatch = useDispatch();
  const {theme, deviceId, setOnNotification} = useContext(AppContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {loading, isLoading, error} = useSelector((state: any) => state.user);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    if (error != null) {
      showError(error);
    }
  }, [error]);

  const isValidData = () => {
    const validError =
      checkEmpty(username, 'Please enter your email address') ||
      checkEmpty(password, 'Please enter your password');
    if (validError) {
      showError(validError);
      return false;
    }
    return true;
  };

  const handleOnUsernameChangeText = (text: string) => {
    setUsername(text.trim());
  };

  const handleOnPassChangeText = (text: string) => {
    setPassword(text.trim());
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        const body: ILoginRequest = {
          username: username,
          password: password,
          grant_type: 'password',
          client_secret: CLIENT_SECRET,
          hash: getHash('LOGIN'),
        };
        dispatch({
          type: 'userLoginRequest',
        });
        await loginPassword(body);
        dispatch({
          type: 'userLoginSuccess',
        });
      } catch (err: any) {
        dispatch({
          type: 'userLoginFailed',
          payload: err.message,
        });
      }
      try {
        dispatch({
          type: 'getUsersRequest',
        });
        const userInfoRes: IUserInfoResponse = await getUserInfo();
        dispatch({
          type: 'getUsersSuccess',
          payload: userInfoRes,
        });
      } catch (err: any) {
        dispatch({
          type: 'getUsersFailed',
        });
      }
      try {
        const res = await getNotificationSetting({deviceId: deviceId});
        setOnNotification(res.receive);
      } catch (err: any) {
        setOnNotification(false);
      }
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            Icon={() => (
              <Ionicons
                name="arrow-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            )}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={20}>
        <Header title="Sign In" />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Enter your credentials
        </Text>
        <Animated.View
          style={[{flex: 1}, space(IconSizes.x5).mt]}
          entering={FadeInDown.delay(200).duration(1000).springify()}>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="person-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              onChangeText={handleOnUsernameChangeText}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              autoFocus
              placeholder="Phone Or Email"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="lock-closed-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              onChangeText={handleOnPassChangeText}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
                {flex: 1},
              ]}
              secureTextEntry={!isPasswordVisible}
              placeholder="Password"
              placeholderTextColor={theme.text02}
            />
            <IconButton
              onPress={() => {
                setPasswordVisible(!isPasswordVisible);
              }}
              style={{marginHorizontal: CONTENT_SPACING}}
              Icon={() => (
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={IconSizes.x6}
                  color={theme.text01}
                />
              )}
            />
          </View>
          <View
            style={[
              {
                alignItems: 'flex-end',
              },
              space(IconSizes.x5).mt,
            ]}>
            <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.accent,
                  },
                ]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles(theme).row, space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleContinue}
              style={[
                styles(theme).button,
                styles(theme).buttonPrimary,
                {flex: 1},
              ]}
              disabled={loading || isLoading}>
              {loading || isLoading ? (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={ThemeStatic.white}
                />
              ) : (
                <Text
                  style={[
                    styles(theme).centerText,
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: ThemeStatic.white,
                    },
                  ]}>
                  Done
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {}}
              style={[styles(theme).button, space(IconSizes.x5).ml]}
              disabled={loading || isLoading}>
              <Ionicons
                name="finger-print"
                size={IconSizes.x9}
                color={theme.text01}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
