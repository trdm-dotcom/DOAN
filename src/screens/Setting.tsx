import {AppContext} from '../context';
import {space, styles} from '../components/style';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {Theme, ThemeStatic} from '../theme/Colors';
import {signOut} from '../reducers/action/authentications';
import {IconSizes, PASSWORD_REGEX} from '../constants/Constants';
import AppOption from '../components/shared/AppOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../theme/Typography';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {Modalize} from 'react-native-modalize';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {showError} from '../utils/Toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '../components/header/Header';
import {updateMode} from '../reducers/action/user';
import CheckBox from 'react-native-check-box';
import {getHash} from '../utils/Crypto';
import IChangePasswordRequest from '../models/request/IChangePasswordRequest';
import {apiPost} from '../utils/Api';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import {OtpIdType} from '../models/enum/OtpIdType';
import IOtpResponse from '../models/response/IOtpResponse';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import {NativeImage} from '../components/shared/NativeImage';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import {checkEmpty, checkRegex} from '../utils/Validate';
import {useDispatch, useSelector} from 'react-redux';
import BlockListBottomSheet from '../components/bottomsheet/BlockListBottomSheet';
import {settingReceiveNotification} from '../reducers/action/notification';
import {
  getFcmToken,
  registerAppWithFCM,
  unRegisterAppWithFCM,
} from '../utils/PushNotification';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Setting'>;
const Setting = ({navigation}: props) => {
  const dispatch = useDispatch();
  const {
    user,
    error,
    loading: userLoading,
  } = useSelector((state: any) => state.user);
  const {
    theme,
    themeType,
    toggleTheme,
    fcmToken,
    deviceId,
    onNotification,
    setOnNotification,
    setFcmToken,
  } = useContext(AppContext);
  const [progess, setProgess] = useState<null | 'changePass' | 'verifyOtp'>(
    null,
  );
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [otpId, setOtpId] = useState<any>(null);
  const [otpValue, setOtpValue] = useState<any>(null);
  const [signoutConfirmationModal, setSignoutConfirmationModal] =
    useState<boolean>(false);
  const [privateModeConfirmationModal, setPrivateModeConfirmationModal] =
    useState<boolean>(false);
  const [turnOffNotificationModal, setTurnOffNotificationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [validError, setValidError] = useState<any>({});

  useEffect(() => {
    if (error != null) {
      showError(error);
      dispatch({type: 'clearErrors'});
    }
  }, [error]);

  const modalizeRef = useRef();
  const blockListBottomSheetRef = useRef();

  const modalizeOpen = () => {
    // @ts-ignore
    return modalizeRef.current.open();
  };

  const modalizeClose = () => {
    // @ts-ignore
    return modalizeRef.current.close();
  };

  const onBlockListOpen = () => {
    // @ts-ignore
    return blockListBottomSheetRef.current.open();
  };

  const signoutConfirmationToggle = () => {
    setSignoutConfirmationModal(previousState => !previousState);
  };

  const privateModeConfirmationToggle = () => {
    setPrivateModeConfirmationModal(previousState => !previousState);
  };

  const turnOffNotificationModalToggle = () => {
    setTurnOffNotificationModal(previousState => !previousState);
  };

  const updateAccountMode = async () => {
    try {
      dispatch({
        type: 'updateUserRequest',
      });
      await updateMode({mode: !user.privateMode});
      dispatch({
        type: 'updateUserSuccess',
        payload: {
          ...user,
          privateMode: !user.privateMode,
        },
      });
    } catch (err: any) {
      dispatch({
        type: 'updateUserFailed',
        payload: err.message,
      });
    }
  };

  const logOut = async () => {
    signOut();
    unRegisterAppWithFCM();
    dispatch({
      type: 'userLogout',
    });
    dispatch({
      type: 'logout',
    });
  };

  const getOtp = async () => {
    try {
      setOtpValue(null);
      setOtpId(null);
      setLoading(true);
      const body = {
        id: user.email,
        idType: OtpIdType.EMAIL,
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
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    let errors = {};
    const validCode = checkEmpty(otpValue, 'Please enter code');
    if (validCode) {
      errors['otp'] = validCode;
    }
    setValidError(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    try {
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
      await apiPost<any>(
        '/user/changePassword',
        {data: body},
        {
          'Content-Type': 'application/json',
        },
      );
      modalizeClose();
      logOut();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changePass = () => {
    let errors = {};
    const validPassword = checkEmpty(oldPassword, 'Old password is required.');
    if (validPassword) {
      errors['password'] = validPassword;
    }
    const validNewPassword =
      checkEmpty(newPassword, 'New password is required.') ||
      newPassword === oldPassword
        ? 'New password must be different from old password.'
        : null ||
          checkRegex(newPassword, 'New password is invalid.', PASSWORD_REGEX);
    if (validNewPassword) {
      errors['newPassword'] = validNewPassword;
    }
    setValidError(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setProgess('verifyOtp');
    getOtp();
  };

  const handleOnPress = async () => {
    try {
      switch (progess) {
        case 'changePass':
          return changePass();
        case 'verifyOtp':
          return verifyOtp();
        default:
          break;
      }
    } catch (err: any) {
      showError(err.message);
    }
  };

  const requestSettingReceiveNotification = async (isReceive: boolean) => {
    try {
      setLoading(true);
      const body = {
        isReceive: isReceive,
        deviceId: deviceId,
        registrationToken: fcmToken,
      };
      if (isReceive) {
        const newFcmToken = await getFcmToken();
        body.registrationToken = newFcmToken;
        setFcmToken(newFcmToken);
        registerAppWithFCM();
      } else {
        setFcmToken(null);
        unRegisterAppWithFCM();
      }
      await settingReceiveNotification(body);
      setOnNotification(isReceive);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <>
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
          </>
        }
        title="Setting"
        titleStyle={{
          ...FontWeights.Bold,
          ...FontSizes.Label,
          color: theme.text01,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[{alignItems: 'center'}, space(IconSizes.x5).mb]}>
          <View
            style={{
              padding: IconSizes.x00,
              borderColor: theme.placeholder,
              borderWidth: IconSizes.x00,
              borderRadius: 120,
            }}>
            <NativeImage uri={user.avatar} style={styles(theme).avatarImage} />
          </View>
          <View
            style={[
              styles(theme).profileNameContainer,
              space(IconSizes.x1).mv,
            ]}>
            <Text style={styles(theme).profileUsernameText}>{user.name}</Text>
          </View>
        </View>
        <View>
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
          <View style={[styles().groupOptionContainer, space(IconSizes.x1).mv]}>
            <AppOption
              label="Dark Mode"
              iconName="moon-outline"
              children={
                <Switch
                  value={themeType === Theme.dark.type}
                  onValueChange={value => {
                    toggleTheme(value ? Theme.dark.type : Theme.light.type);
                  }}
                  thumbColor={
                    themeType === Theme.dark.type
                      ? ThemeStatic.accent
                      : theme.base
                  }
                  ios_backgroundColor={theme.base}
                  trackColor={{
                    false: theme.base,
                    true: ThemeStatic.accent,
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
                  <Switch
                    value={onNotification}
                    onValueChange={value => {
                      if (value) {
                        requestSettingReceiveNotification(true);
                      } else {
                        turnOffNotificationModalToggle();
                      }
                    }}
                    thumbColor={
                      onNotification ? ThemeStatic.accent : theme.base
                    }
                    ios_backgroundColor={theme.base}
                    trackColor={{
                      false: theme.base,
                      true: ThemeStatic.accent,
                    }}
                  />
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
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
          <View style={[styles().groupOptionContainer, space(IconSizes.x1).mv]}>
            <AppOption
              label="Private Profile"
              iconName="lock-closed-outline"
              children={
                <Switch
                  value={user.privateMode}
                  onValueChange={value => {
                    if (value) {
                      privateModeConfirmationToggle();
                    } else {
                      updateAccountMode();
                    }
                  }}
                  thumbColor={
                    user.privateMode ? ThemeStatic.accent : theme.base
                  }
                  ios_backgroundColor={theme.base}
                  trackColor={{
                    false: theme.base,
                    true: ThemeStatic.accent,
                  }}
                />
              }
              style={space(IconSizes.x00).mb}
            />
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
                style={space(IconSizes.x00).mb}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onBlockListOpen()}>
              <AppOption
                label="Blocked users"
                iconName="ban-outline"
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
        </View>
        <View>
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
            <TouchableOpacity onPress={signoutConfirmationToggle}>
              <AppOption
                label="Sign out"
                iconName="log-out-outline"
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
        </View>
      </ScrollView>
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}
        onClosed={() => {
          setProgess(null);
          setValidError({});
          setPasswordVisible(false);
        }}
        adjustToContentHeight>
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          {progess === 'changePass' && (
            <>
              <Header title="Change password" />
              <View style={[styles(theme).inputContainer, styles(theme).row]}>
                <TextInput
                  onChangeText={(text: string) => {
                    setOldPassword(text.trim());
                  }}
                  style={[
                    styles(theme).inputField,
                    {
                      ...FontWeights.Regular,
                      ...FontSizes.Body,
                      color: theme.text01,
                    },
                  ]}
                  secureTextEntry={!isPasswordVisible}
                  placeholder="Old Password"
                  placeholderTextColor={theme.text02}
                />
              </View>
              <View style={[styles(theme).inputContainer, styles(theme).row]}>
                <TextInput
                  onChangeText={(text: string) => {
                    setNewPassword(text.trim());
                  }}
                  style={[
                    styles(theme).inputField,
                    {
                      ...FontWeights.Regular,
                      ...FontSizes.Body,
                      color: theme.text01,
                    },
                  ]}
                  secureTextEntry={!isPasswordVisible}
                  placeholder="New Password"
                  placeholderTextColor={theme.text02}
                />
              </View>
              <View style={[{alignItems: 'flex-end'}, space(IconSizes.x5).mv]}>
                <CheckBox
                  style={{flex: 1}}
                  onClick={() => {
                    setPasswordVisible(!isPasswordVisible);
                  }}
                  isChecked={isPasswordVisible}
                  leftText={'Show'}
                  leftTextStyle={{
                    ...FontWeights.Regular,
                    ...FontSizes.Body,
                    color: theme.text01,
                    marginRight: 10,
                  }}
                  checkBoxColor={theme.text02}
                  checkedCheckBoxColor={ThemeStatic.accent}
                />
              </View>
              <Text
                style={[
                  {
                    ...FontWeights.Light,
                    ...FontSizes.Caption,
                    color: theme.text02,
                  },
                ]}>
                Your password must be at least 8 characters, at least one number
                and both lower and uppercase letters and special characters
              </Text>
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
                  onChangeText={(text: string) => setOtpValue(text.trim())}
                  style={[
                    styles(theme).inputField,
                    {
                      ...FontWeights.Regular,
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
                <TouchableOpacity onPress={getOtp} style={styles(theme).button}>
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
              </View>
            </>
          )}
          <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleOnPress}
              disabled={loading || userLoading}
              style={[styles(theme).button, styles(theme).buttonPrimary]}>
              {loading || userLoading ? (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={ThemeStatic.white}
                />
              ) : progess === 'changePass' ? (
                <>
                  <Text
                    style={[
                      styles(theme).centerText,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: ThemeStatic.white,
                      },
                    ]}>
                    Next step
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={IconSizes.x6}
                    color={ThemeStatic.white}
                  />
                </>
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
            {Object.values(validError).map((errMessage: any, index: number) => (
              <Text
                key={index}
                style={{
                  ...FontWeights.Regular,
                  ...FontSizes.Caption,
                  color: 'red',
                }}>
                {errMessage}
              </Text>
            ))}
          </View>
        </KeyboardAvoidingView>
      </Modalize>
      <ConfirmationModal
        label="Sign Out"
        title="Sign out?"
        color="red"
        isVisible={signoutConfirmationModal}
        toggle={signoutConfirmationToggle}
        onConfirm={() => {
          signoutConfirmationToggle();
          logOut();
        }}
      />
      <ConfirmationModal
        label="Ok"
        title="Switch to private account?"
        isVisible={privateModeConfirmationModal}
        toggle={privateModeConfirmationToggle}
        onConfirm={() => {
          privateModeConfirmationToggle();
          updateAccountMode();
        }}
      />
      <ConfirmationModal
        label="Ok"
        title="Turn off notification?"
        isVisible={turnOffNotificationModal}
        toggle={turnOffNotificationModalToggle}
        onConfirm={() => {
          turnOffNotificationModalToggle();
          requestSettingReceiveNotification(false);
        }}
      />
      <BlockListBottomSheet ref={blockListBottomSheetRef} />
    </GestureHandlerRootView>
  );
};

export default Setting;
