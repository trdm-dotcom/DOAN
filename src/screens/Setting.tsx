import {AppContext} from '../context';
import {space, styles} from '../components/style';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {ThemeVariant} from '../theme/Colors';
import {signOut} from '../reducers/action/authentications';
import {logout} from '../reducers/redux/authentication.reducer';
import {useAppDispatch, useAppSelector} from '../reducers/redux/store';
import {IconSizes} from '../constants/Constants';
import AppOption from '../components/shared/AppOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../theme/Typography';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {NativeImage} from '../components/shared/NativeImage';
import AppButton from '../components/control/AppButton';
import {Modalize} from 'react-native-modalize';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {showError} from '../utils/Toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '../components/header/Header';
import {putUserInfo} from '../reducers/action/user';
import {userInfo as updateUserInfo} from '../reducers/redux/authentication.reducer';
import CheckBox from 'react-native-check-box';
import {getHash} from '../utils/Crypto';
import IChangePasswordRequest from '../models/request/IChangePasswordRequest';
import {apiPost} from '../utils/Api';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import {OtpIdType} from '../models/enum/OtpIdType';
import IOtpResponse from '../models/response/IOtpResponse';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';

const {FontWeights, FontSizes} = Typography;

const Setting = () => {
  const dispatch = useAppDispatch();
  const userInfo: IUserInfoResponse = useAppSelector(
    state => state.auth.userInfo,
  );
  const {theme, themeType, toggleTheme, fcmToken} = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(themeType === ThemeVariant.dark);
  const [signoutConfirmationModal, setSignoutConfirmationModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>(userInfo.name);
  const [progess, setProgess] = useState<
    null | 'changePass' | 'editInfo' | 'verifyOtp'
  >(null);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [otpId, setOtpId] = useState<string>('');
  const [otpValue, setOtpValue] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(1);
  const [seconds, setSeconds] = useState<number>(30);

  const modalizeRef = React.useRef<Modalize>(null);

  const modalizeOpen = () => modalizeRef.current?.open();

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setIsContinue(false);
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  const handleSwitch = () => {
    if (isDarkMode) {
      toggleTheme(ThemeVariant.dark);
    } else {
      toggleTheme(ThemeVariant.light);
    }
    setIsDarkMode(previousState => !previousState);
  };

  const logOut = async () => {
    try {
      await signOut();
    } finally {
      dispatch(logout());
    }
  };

  const signoutConfirmationToggle = () => {
    setSignoutConfirmationModal(previousState => !previousState);
  };

  const getOtp = async () => {
    try {
      setLoading(true);
      const body = {
        id: userInfo.phoneNumber ? userInfo.phoneNumber : fcmToken,
        idType: userInfo.phoneNumber ? OtpIdType.SMS : OtpIdType.FIREBASE,
        txtType: OtpTxtType.VERIFY,
      };
      const response: IOtpResponse = await apiPost<IOtpResponse>(
        '/otp',
        {data: body},
        {
          'Content-Type': 'application/json',
        },
      );
      setOtpId(response.otpId);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editInfo = async () => {
    await putUserInfo({
      name: name,
    });
    userInfo.name = name;
    dispatch(updateUserInfo(userInfo));
    modalizeRef.current?.close();
  };

  const verifyOtp = async () => {
    const bodyVerifyOtp = {otpId: otpId, otpValue: otpValue};
    const response: IVerifyOtpResponse = await apiPost<IVerifyOtpResponse>(
      '/otp/verify',
      {data: bodyVerifyOtp},
      {
        'Content-Type': 'application/json',
      },
    );
    const body: IChangePasswordRequest = {
      otpKey: response.otpKey,
      oldPassword: oldPassword,
      newPassword: newPassword,
      hash: getHash('PASSWORD'),
    };
    await apiPost<any>('/user/changePassword', body);
    modalizeRef.current?.close();
  };

  const changePass = async () => {
    getOtp();
    setProgess('verifyOtp');
  };

  const resendOtp = async () => {
    setOtpValue('');
    setOtpId('');
    setMinutes(1);
    setSeconds(30);
    await getOtp();
  };

  const handleOnPress = async () => {
    try {
      setLoading(true);
      switch (progess) {
        case 'changePass':
          return await changePass();
        case 'editInfo':
          return await editInfo();
        case 'verifyOtp':
          return verifyOtp();
        default:
          break;
      }
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GestureHandlerRootView
        style={[styles(theme).container, styles(theme).defaultBackground]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              {alignItems: 'center'},
              space(IconSizes.x10).mt,
              space(IconSizes.x5).mb,
            ]}>
            <View
              style={{
                padding: IconSizes.x00,
                borderColor: theme.placeholder,
                borderWidth: IconSizes.x00,
                borderRadius: 110,
              }}>
              <NativeImage
                uri={userInfo.avatar}
                style={styles(theme).avatarImage}
              />
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {}}
                style={{
                  position: 'absolute',
                  borderRadius: 100,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: theme.accent,
                }}>
                <Ionicons name="add" size={IconSizes.x8} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles(theme).profileNameContainer,
                space(IconSizes.x1).mv,
              ]}>
              <Text style={styles(theme).profileUsernameText}>{name}</Text>
            </View>
            <AppButton
              label="Edit Info"
              onPress={() => {
                setProgess('editInfo');
                modalizeOpen();
              }}
              labelStyle={{
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              }}
              containerStyle={[
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.placeholder,
                  paddingHorizontal: IconSizes.x5,
                  height: IconSizes.x9,
                  borderRadius: 50,
                },
              ]}
            />
          </View>
          <View style={[styles(theme).row]}>
            <Ionicons
              name="settings-outline"
              size={IconSizes.x6}
              color={theme.text01}
            />
            <Text
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Label,
                  color: theme.text01,
                },
                space(IconSizes.x1).ml,
              ]}>
              Setting
            </Text>
          </View>
          <View style={[styles().groupOptionContainer, space(IconSizes.x5).mv]}>
            <AppOption
              label="Dark Mode"
              iconName="moon-outline"
              children={
                <Switch
                  value={isDarkMode}
                  onValueChange={handleSwitch}
                  thumbColor={isDarkMode ? theme.accent : theme.base}
                  ios_backgroundColor={theme.base}
                  trackColor={{
                    false: theme.base,
                    true: theme.accent,
                  }}
                />
              }
              style={space(IconSizes.x00).mb}
            />
            <TouchableOpacity>
              <AppOption
                label="Notification"
                iconName="notifications-outline"
                children={
                  <Ionicons
                    name="chevron-forward"
                    color={theme.base}
                    size={IconSizes.x6}
                  />
                }
              />
            </TouchableOpacity>
          </View>
          <View style={[styles(theme).row]}>
            <Ionicons
              name="person-outline"
              size={IconSizes.x6}
              color={theme.text01}
            />
            <Text
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Label,
                  color: theme.text01,
                },
                space(IconSizes.x1).ml,
              ]}>
              General
            </Text>
          </View>
          <View style={[styles().groupOptionContainer, space(IconSizes.x5).mv]}>
            <TouchableOpacity
              onPress={() => {
                setProgess('changePass');
                modalizeOpen();
              }}>
              <AppOption
                label="Change Password"
                iconName="lock-closed-outline"
                children={
                  <Ionicons
                    name="chevron-forward"
                    color={theme.base}
                    size={IconSizes.x6}
                  />
                }
              />
            </TouchableOpacity>
          </View>
          <View style={[styles(theme).row]}>
            <Ionicons
              name="hand-left-outline"
              size={IconSizes.x6}
              color={theme.text01}
            />
            <Text
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Label,
                  color: theme.text01,
                },
                space(IconSizes.x1).ml,
              ]}>
              Danger Zone
            </Text>
          </View>
          <View style={[styles().groupOptionContainer, space(IconSizes.x5).mv]}>
            <TouchableOpacity onPress={() => signoutConfirmationToggle()}>
              <AppOption
                label="Sign out"
                iconName="log-out-outline"
                color="red"
                children={
                  <Ionicons
                    name="chevron-forward"
                    color={theme.base}
                    size={IconSizes.x6}
                  />
                }
                style={space(IconSizes.x00).mb}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AppOption
                label="Delete Account"
                iconName="sad-outline"
                color="red"
                children={
                  <Ionicons
                    name="chevron-forward"
                    color={theme.base}
                    size={IconSizes.x6}
                  />
                }
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ConfirmationModal
          label="Sign Out"
          title="Are you sure you want to sign out?"
          color="red"
          isVisible={signoutConfirmationModal}
          toggle={signoutConfirmationToggle}
          onConfirm={logOut}
        />
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          modalStyle={[
            styles(theme).container,
            styles(theme).defaultBackground,
          ]}>
          <KeyboardAvoidingView style={[{flex: 1}, space(IconSizes.x10).mt]}>
            {progess === 'editInfo' && (
              <>
                <Header title="Edit your name" />
                <View style={[styles(theme).inputContainer]}>
                  <TextInput
                    value={name}
                    onChangeText={(text: string) => {
                      const verify: boolean = text.trim().length > 0;
                      setIsContinue(verify);
                      if (verify) {
                        setName(text.trim());
                      }
                    }}
                    style={[
                      styles(theme).inputField,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                    ]}
                    placeholder="Your name"
                    placeholderTextColor={theme.text02}
                  />
                </View>
              </>
            )}
            {progess === 'verifyOtp' && (
              <>
                <Header title="OTP sent" />
                <Text
                  style={[
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Caption,
                      color: theme.text02,
                    },
                  ]}>
                  Enter the code sent to your phone
                </Text>
                <View style={[styles(theme).inputContainer]}>
                  <TextInput
                    style={[
                      styles(theme).inputField,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                    ]}
                    autoFocus
                    keyboardType="numeric"
                    placeholder="OTP"
                    placeholderTextColor={theme.text02}
                  />
                </View>
                <View style={styles(theme).row}>
                  <Text
                    style={[
                      {
                        ...FontWeights.Regular,
                        ...FontSizes.Caption,
                        color: theme.text01,
                      },
                      space(IconSizes.x00).mr,
                    ]}>
                    Didn't receive the code?{' '}
                  </Text>
                  {seconds > 0 || minutes > 0 ? (
                    <Text
                      style={[
                        {
                          ...FontWeights.Regular,
                          ...FontSizes.Caption,
                          color: theme.text01,
                        },
                      ]}>
                      Resend in: {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={resendOtp}
                      style={styles(theme).button}>
                      <Text
                        style={[
                          {
                            ...FontWeights.Bold,
                            ...FontSizes.Caption,
                            color: theme.text01,
                          },
                        ]}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
            {progess === 'changePass' && (
              <>
                <Header title="Change password" />
                <View style={[styles(theme).inputContainer, styles(theme).row]}>
                  <TextInput
                    onChangeText={(text: string) => {
                      const verify: boolean =
                        text.trim().length > 0 && newPassword.length > 0;
                      setIsContinue(verify);
                      setOldPassword(text.trim());
                    }}
                    style={[
                      styles(theme).inputField,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                    ]}
                    autoFocus
                    secureTextEntry={!isPasswordVisible}
                    placeholder="Old Password"
                    placeholderTextColor={theme.text02}
                  />
                </View>
                <View style={[styles(theme).inputContainer, styles(theme).row]}>
                  <TextInput
                    onChangeText={(text: string) => {
                      const verify: boolean =
                        text.trim().length > 0 && oldPassword.length > 0;
                      setIsContinue(verify);
                      setNewPassword(text.trim());
                    }}
                    style={[
                      styles(theme).inputField,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                    ]}
                    secureTextEntry={!isPasswordVisible}
                    placeholder="New Password"
                    placeholderTextColor={theme.text02}
                  />
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <CheckBox
                    style={{flex: 1, padding: 10}}
                    onClick={() => {
                      setPasswordVisible(!isPasswordVisible);
                    }}
                    isChecked={isPasswordVisible}
                    leftText="Show"
                    leftTextStyle={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                      space(IconSizes.x1).mr,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Caption,
                      color: theme.text02,
                    },
                  ]}>
                  Your password must be at least 8 characters
                </Text>
              </>
            )}
            <View
              style={[
                {flex: 1, justifyContent: 'flex-end'},
                space(IconSizes.x5).mt,
              ]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleOnPress}
                disabled={!isContinue || loading}
                style={[
                  styles(theme).button,
                  styles(theme).buttonPrimary,
                  {flex: 1},
                ]}>
                {loading ? (
                  <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
                ) : progess === 'changePass' ? (
                  <>
                    <Text
                      style={[
                        styles(theme).centerText,
                        {
                          ...FontWeights.Bold,
                          ...FontSizes.Body,
                          color: theme.text01,
                        },
                      ]}>
                      Next step
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={IconSizes.x6}
                      color={theme.text01}
                    />
                  </>
                ) : (
                  <Text
                    style={[
                      styles(theme).centerText,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                    ]}>
                    Done
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modalize>
      </GestureHandlerRootView>
    </>
  );
};

export default Setting;
