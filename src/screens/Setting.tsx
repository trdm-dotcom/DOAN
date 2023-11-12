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
import {CONTENT_SPACING, IconSizes} from '../constants/Constants';
import AppOption from '../components/shared/AppOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../theme/Typography';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import AppButton from '../components/control/AppButton';
import {Modalize} from 'react-native-modalize';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {showError} from '../utils/Toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '../components/header/Header';
import {
  confirmUser,
  disableUser,
  putUserInfo,
  updateMode,
} from '../reducers/action/user';
import CheckBox from 'react-native-check-box';
import {getHash} from '../utils/Crypto';
import IChangePasswordRequest from '../models/request/IChangePasswordRequest';
import {apiPost} from '../utils/Api';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import {OtpIdType} from '../models/enum/OtpIdType';
import IOtpResponse from '../models/response/IOtpResponse';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {NativeImage} from '../components/shared/NativeImage';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import {checkEmpty} from '../utils/Validate';
import {useDispatch, useSelector} from 'react-redux';
import BlockListBottomSheet from '../components/bottomsheet/BlockListBottomSheet';
import Option from '../components/shared/Option';
import {Image as ImageCompressor} from 'react-native-compressor';
import {settingReceiveNotification} from '../reducers/action/notification';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Setting'>;
const Setting = ({navigation}: props) => {
  const dispatch = useDispatch();
  const {user, isLoading, error} = useSelector((state: any) => state.user);
  const {
    theme,
    themeType,
    toggleTheme,
    fcmToken,
    deviceId,
    onNotification,
    setOnNotification,
  } = useContext(AppContext);
  const [name, setName] = useState<string>(user.name);
  const [about, setAbout] = useState<string>(user.about);
  const [avatar, setAvatar] = useState<any>(user.avatar);
  const [avatarFilename, setAvatarFilename] = useState<any>(null);
  const [progess, setProgess] = useState<
    null | 'changePass' | 'editInfo' | 'verifyOtp' | 'confirm' | 'deleteAccount'
  >(null);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpId, setOtpId] = useState<any>(null);
  const [otpValue, setOtpValue] = useState<any>(null);
  const [signoutConfirmationModal, setSignoutConfirmationModal] =
    useState<boolean>(false);
  const [privateModeConfirmationModal, setPrivateModeConfirmationModal] =
    useState<boolean>(false);
  const [deleteAccountConfirmationModal, setDeleteAccountConfirmationModal] =
    useState<boolean>(false);
  const [turnOffNotificationModal, setTurnOffNotificationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error != null) {
      showError(error);
    }
  }, [error]);

  const modalizeRef = useRef();
  const deleteAccountBottomSheetRef = useRef();
  const avatarOptionsBottomSheetRef = useRef();
  const blockListBottomSheetRef = useRef();

  const modalizeOpen = () => {
    // @ts-ignore
    return modalizeRef.current.open();
  };

  const modalizeClose = () => {
    // @ts-ignore
    return modalizeRef.current.close();
  };

  const deleteAccountOpen = () => {
    // @ts-ignore
    return deleteAccountBottomSheetRef.current.open();
  };

  const deleteAccountClose = () => {
    // @ts-ignore
    return deleteAccountBottomSheetRef.current.close();
  };

  const openOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.close();
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

  const deleteAccountConfirmationToggle = () => {
    setDeleteAccountConfirmationModal(previousState => !previousState);
  };

  const turnOffNotificationModalToggle = () => {
    setTurnOffNotificationModal(previousState => !previousState);
  };

  const requestImageModeration = async (imageData: string, filename: string) =>
    await apiPost<any>('/moderation/image', {
      data: {imageData: imageData, filename: filename},
    });

  const requestTextModeration = async (text: string) =>
    await apiPost<any>('/moderation/text', {
      data: {text: text},
    });

  const onOpenCamera = async () => {
    try {
      closeOptions();
      const image: Image = await ImagePicker.openCamera({
        compressImageQuality: 0.6,
        includeBase64: true,
        writeTempFile: false,
        useFrontCamera: true,
      });
      if (image.data != null) {
        const compressedImage = await ImageCompressor.compress(image.path, {
          maxWidth: 480,
          maxHeight: 480,
          input: 'uri',
          compressionMethod: 'auto',
          quality: 0.6,
          returnableOutputType: 'base64',
        });
        setAvatar(`data:${image.mime};base64,${compressedImage}`);
        setAvatarFilename(image.filename);
        editInfo(
          name,
          `data:${image.mime};base64,${compressedImage}`,
          about,
          image.filename,
        );
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onOpenGallery = async () => {
    try {
      closeOptions();
      const image: Image = await ImagePicker.openPicker({
        compressImageQuality: 0.6,
        includeBase64: true,
        writeTempFile: false,
      });
      if (image.data != null) {
        const compressedImage = ImageCompressor.compress(image.path, {
          maxWidth: 480,
          maxHeight: 480,
          input: 'uri',
          compressionMethod: 'auto',
          quality: 0.6,
          returnableOutputType: 'base64',
        });
        setAvatar(`data:${image.mime};base64,${compressedImage}`);
        setAvatarFilename(image.filename);
        await editInfo(
          name,
          `data:${image.mime};base64,${compressedImage}`,
          about,
          image.filename,
        );
      }
    } catch (err: any) {
      console.log(err);
    }
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
    try {
      dispatch({
        type: 'userLogoutRequest',
      });
      await signOut();
      dispatch({
        type: 'userLogoutSuccess',
      });
    } catch (err: any) {
      dispatch({
        type: 'userLogoutFailed',
        payload: err.message,
      });
    }
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

  const editInfo = async (
    nameEdit: any,
    avatarEdit: any,
    aboutEdit: any,
    avatarFilenameEdit: any,
  ) => {
    const validError = checkEmpty(name, 'Please enter your name');
    if (validError) {
      showError(validError);
      return;
    }
    try {
      dispatch({
        type: 'updateUserRequest',
      });
      if (avatarEdit != null && avatarFilenameEdit != null) {
        await requestImageModeration(avatarEdit, avatarFilenameEdit);
      }
      if (about !== user.about) {
        await requestTextModeration(about);
      }
      await putUserInfo({
        name: nameEdit,
        avatar: avatarEdit,
        about: aboutEdit,
      });
      dispatch({
        type: 'updateUserSuccess',
        payload: {
          ...user,
          name: nameEdit,
          avatar: avatarEdit,
          about: aboutEdit,
        },
      });
      setAvatarFilename(null);
      modalizeClose();
    } catch (err: any) {
      dispatch({
        type: 'updateUserFailed',
        payload: err.message,
      });
    }
  };

  const verifyOtp = async () => {
    const validError = checkEmpty(name, 'Please enter code');
    if (validError) {
      showError(validError);
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
      await apiPost<any>('/user/changePassword', body, {
        'Content-Type': 'application/json',
      });
      modalizeClose();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changePass = () => {
    const validError =
      checkEmpty(oldPassword, 'Please enter your old password') ||
      checkEmpty(newPassword, 'Please enter your new password');
    if (validError) {
      showError(validError);
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
        case 'editInfo':
          return editInfo(name, avatar, about, avatarFilename);
        case 'verifyOtp':
          return verifyOtp();
        case 'confirm':
          return requestConfirm();
        case 'deleteAccount':
          return deleteAccount();
        default:
          break;
      }
    } catch (err: any) {
      showError(err.message);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      const bodyVerifyOtp = {otpId: otpId, otpValue: otpValue};
      const response: IVerifyOtpResponse = await apiPost<IVerifyOtpResponse>(
        '/otp/verify',
        {data: bodyVerifyOtp},
        {
          'Content-Type': 'application/json',
        },
      );
      const body = {
        otpKey: response.otpKey,
        hash: getHash('DELETE_USER'),
      };
      await disableUser(body);
      await logOut();
      deleteAccountClose();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestConfirm = async () => {
    try {
      setLoading(true);
      const body = {
        password: password,
      };
      const res = await confirmUser(body);
      if (res.value) {
        setProgess('deleteAccount');
        getOtp();
      } else {
        showError("Password doesn't match");
      }
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
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
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={isLoading}
              onPress={openOptions}
              style={{
                position: 'absolute',
                bottom: -10,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
                width: 60,
                height: 30,
                borderWidth: 2,
                borderColor: theme.base,
                backgroundColor: theme.accent,
              }}>
              <Ionicons
                name="add"
                size={IconSizes.x6}
                color={ThemeStatic.white}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles(theme).profileNameContainer,
              space(IconSizes.x1).mv,
            ]}>
            <Text style={styles(theme).profileUsernameText}>{user.name}</Text>
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
                borderRadius: 50,
              },
            ]}
          />
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
                    if (value) {
                      turnOffNotificationModalToggle();
                    } else {
                      requestSettingReceiveNotification(true);
                    }
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
            <TouchableOpacity onPress={() => {}}>
              <AppOption
                label="Biometric"
                iconName="finger-print-outline"
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
                style={space(IconSizes.x00).mb}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteAccountConfirmationToggle}>
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
        </View>
      </ScrollView>
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={20}>
          {progess === 'editInfo' && (
            <>
              <BottomSheetHeader
                heading="Edit profile"
                subHeading="Edit your personal information"
              />
              <View style={[styles(theme).inputContainer, styles(theme).row]}>
                <Ionicons
                  name="person-outline"
                  size={IconSizes.x6}
                  color={theme.text02}
                />
                <TextInput
                  value={user.name}
                  onChangeText={(text: string) => {
                    setName(text);
                  }}
                  style={[
                    styles(theme).inputField,
                    {
                      ...FontWeights.Regular,
                      ...FontSizes.Body,
                      color: theme.text01,
                    },
                  ]}
                  placeholder="Your name"
                  placeholderTextColor={theme.text02}
                />
              </View>
              <View style={[styles(theme).inputContainer, styles(theme).row]}>
                <Ionicons
                  name="person-outline"
                  size={IconSizes.x6}
                  color={theme.text02}
                />
                <TextInput
                  value={user.about}
                  onChangeText={(text: string) => {
                    setAbout(text);
                  }}
                  style={[
                    styles(theme).inputField,
                    {
                      ...FontWeights.Regular,
                      ...FontSizes.Body,
                      color: theme.text01,
                    },
                  ]}
                  placeholder="About"
                  placeholderTextColor={theme.text02}
                />
              </View>
            </>
          )}
          {progess === 'changePass' && (
            <>
              <Header title="Change password" />
              <View style={[styles(theme).inputContainer, styles(theme).row]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={IconSizes.x6}
                  color={theme.text02}
                />
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
                <Ionicons
                  name="lock-closed-outline"
                  size={IconSizes.x6}
                  color={theme.text02}
                />
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
              <View style={{alignItems: 'flex-end'}}>
                <CheckBox
                  style={{flex: 1}}
                  onClick={() => {
                    setPasswordVisible(!isPasswordVisible);
                  }}
                  isChecked={isPasswordVisible}
                  leftText="Show"
                  leftTextStyle={{
                    ...FontWeights.Regular,
                    ...FontSizes.Body,
                    color: theme.text01,
                    marginRight: 10,
                  }}
                />
              </View>
              <Text
                style={[
                  {
                    ...FontWeights.Regular,
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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleOnPress}
            disabled={isLoading || loading}
            style={[styles(theme).button, styles(theme).buttonPrimary]}>
            {isLoading || loading ? (
              <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
            ) : progess === 'confirm' || progess === 'changePass' ? (
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
        </KeyboardAvoidingView>
      </Modalize>
      <Modalize
        ref={deleteAccountBottomSheetRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        {progess === 'confirm' && (
          <>
            <Header title="Verify password" />
            <View style={[styles(theme).inputContainer, styles(theme).row]}>
              <Ionicons
                name="lock-closed-outline"
                size={IconSizes.x6}
                color={theme.text02}
              />
              <TextInput
                onChangeText={(text: string) => setPassword(text.trim())}
                style={[
                  styles(theme).inputField,
                  {
                    ...FontWeights.Regular,
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
          </>
        )}
        {progess === 'deleteAccount' && (
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleOnPress}
          disabled={isLoading || loading}
          style={[styles(theme).button, styles(theme).buttonPrimary]}>
          {isLoading || loading ? (
            <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
          ) : progess === 'confirm' || progess === 'changePass' ? (
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
      </Modalize>
      <Modalize
        ref={avatarOptionsBottomSheetRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        <View
          style={[
            {
              flex: 1,
              paddingTop: 20,
              paddingBottom: 16,
            },
          ]}>
          <Option
            label="Take a photo"
            iconName="camera-outline"
            color={theme.text01}
            onPress={onOpenCamera}
          />
          <Option
            label="Choose from gallery"
            iconName="images-outline"
            color={theme.text01}
            onPress={onOpenGallery}
          />
          <Option
            label="Delete"
            iconName="close-circle-outline"
            color="red"
            onPress={() => editInfo(name, null, about, null)}
          />
        </View>
      </Modalize>
      <ConfirmationModal
        label="Sign Out"
        title="Are you sure you want to sign out?"
        color="red"
        isVisible={signoutConfirmationModal}
        toggle={signoutConfirmationToggle}
        onConfirm={logOut}
      />
      <ConfirmationModal
        label="Ok"
        title="Switch to private account?"
        isVisible={privateModeConfirmationModal}
        toggle={privateModeConfirmationToggle}
        onConfirm={updateAccountMode}
      />
      <ConfirmationModal
        label="Ok"
        title="Turn off notification?"
        isVisible={turnOffNotificationModal}
        toggle={turnOffNotificationModalToggle}
        onConfirm={() => requestSettingReceiveNotification(false)}
      />
      <ConfirmationModal
        label="Continue deleting account"
        title="Delete your Fotei account?"
        color="red"
        isVisible={deleteAccountConfirmationModal}
        toggle={deleteAccountConfirmationToggle}
        onConfirm={() => {
          setProgess('confirm');
          deleteAccountConfirmationToggle();
          deleteAccountOpen();
        }}
      />
      <BlockListBottomSheet ref={blockListBottomSheetRef} />
    </GestureHandlerRootView>
  );
};

export default Setting;
