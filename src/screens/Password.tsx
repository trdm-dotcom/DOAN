import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {space, styles} from '../components/style';
import {getHash} from '../utils/Crypto';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty, checkRegex} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {IconSizes, PASSWORD_REGEX} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  register,
  password as loginPassword,
} from '../reducers/action/authentications';
import HeaderBar from '../components/header/HeaderBar';
import {AppContext} from '../context';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Typography from '../theme/Typography';
import CheckBox from 'react-native-check-box';
import Header from '../components/header/Header';
import IconButton from '../components/control/IconButton';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {getUserInfo, putUserInfo} from '../reducers/action/user';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {ThemeStatic} from '../theme/Colors';
import {NativeImage} from '../components/shared/NativeImage';
import {ILoginRequest} from '../models/request/ILoginRequest.model';
import {IRegisterRequest} from '../models/request/IRegisterRequest';
import {useDispatch, useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import Option from '../components/shared/Option';
import {Image as ImageCompressor} from 'react-native-compressor';
import {settingReceiveNotification} from '../reducers/action/notification';
import {CLIENT_SECRET} from '@env';
import {localApiPost} from '../utils/Api';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Password'>;

const Password = ({navigation, route}: props) => {
  const dispatch = useDispatch();
  const {theme, fcmToken, deviceId, setOnNotification} = useContext(AppContext);
  const {name, phoneNumber, mail, otpKey} = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [avatarData, setAvatarData] = useState<any>(null);
  const {isLoading, error} = useSelector((state: any) => state.user);
  const [validError, setValidError] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const avatarOptionsBottomSheetRef = useRef();

  useEffect(() => {
    if (error != null) {
      showError(error);
      dispatch({type: 'clearErrors'});
    }
  }, [error]);

  const isValidData = () => {
    let errors = {};
    const validPassword =
      checkEmpty(password, 'Password is required.') ||
      checkRegex(password, 'Password is invalid.', PASSWORD_REGEX);
    if (validPassword) {
      errors['password'] = validPassword;
    }
    const validComparePassword =
      password !== confirmPassword
        ? 'Password and confirm password do not match'
        : null;
    if (validComparePassword) {
      errors['confirmPassword'] = validComparePassword;
    }
    setValidError(errors);
    return Object.keys(errors).length === 0;
  };

  const requestImageModeration = async (imageData: string, filename: string) =>
    await localApiPost<any>('/moderation/image', {
      data: {imageData: imageData, filename: filename},
    });

  const createAccount = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        const bodyRegister: IRegisterRequest = {
          phoneNumber: phoneNumber,
          password: password,
          name: name,
          otpKey: otpKey,
          email: mail,
          hash: getHash('REGISTER'),
        };
        await register(bodyRegister);
        const body: ILoginRequest = {
          username: mail,
          password: password,
          grant_type: 'password',
          client_secret: CLIENT_SECRET,
          hash: getHash('LOGIN'),
        };
        loginPassword(body).catch(() => {
          navigation.navigate('SignIn');
        });
      } catch (err: any) {
        showError(err.message);
        return;
      } finally {
        setLoading(false);
      }
      setAccountCreated(true);
    }
  };

  const openOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.close();
  };

  const onNext = async () => {
    try {
      if (avatarData != null) {
        try {
          const res = await requestImageModeration(avatarData, 'image.jpg');
          if (res.summary.action === 'reject') {
            showError('Content is not allowed');
            return;
          }
        } catch (err: any) {
          console.log(err);
          showError(err.message);
          navigation.navigate('Main');
        }
      }
      await Promise.all([
        putUserInfo({
          name: name,
          avatar: avatarData,
        }),
        requestSettingReceiveNotification(true),
      ]);
      dispatch({
        type: 'getUsersRequest',
      });
      const userInfoRes: IUserInfoResponse = await getUserInfo();
      dispatch({
        type: 'getUsersSuccess',
        payload: userInfoRes,
      });
      dispatch({
        type: 'authenticated',
      });
    } catch (err: any) {
      dispatch({
        type: 'getUsersFailed',
        payload: err.message,
      });
      showError(error.message);
    }
  };

  const requestSettingReceiveNotification = async (isReceive: boolean) => {
    const body = {
      isReceive: isReceive,
      deviceId: deviceId,
      registrationToken: fcmToken,
    };
    await settingReceiveNotification(body);
    setOnNotification(isReceive);
  };

  const onOpenCamera = () => {
    closeOptions();
    ImagePicker.openCamera({
      width: 480,
      height: 480,
      cropping: true,
      compressImageQuality: 0.6,
      includeBase64: true,
      writeTempFile: false,
      useFrontCamera: true,
    })
      .then((image: Image) => {
        if (image.data != null) {
          ImageCompressor.compress(image.path, {
            maxWidth: 480,
            maxHeight: 480,
            input: 'uri',
            compressionMethod: 'auto',
            quality: 0.6,
            returnableOutputType: 'base64',
          }).then((compressedImage: string) => {
            setAvatarData(`data:${image.mime};base64,${compressedImage}`);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onOpenGallery = () => {
    closeOptions();
    ImagePicker.openPicker({
      width: 480,
      height: 480,
      cropping: true,
      compressImageQuality: 0.6,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        if (image.data != null) {
          ImageCompressor.compress(image.path, {
            maxWidth: 480,
            maxHeight: 480,
            input: 'base64',
            compressionMethod: 'auto',
            quality: 0.6,
            returnableOutputType: 'base64',
          }).then((compressedImage: string) => {
            setAvatarData(`data:${image.mime};base64,${compressedImage}`);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <GestureHandlerRootView
        style={[styles(theme).container, styles(theme).defaultBackground]}>
        {accountCreated ? (
          <View
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <View
              style={{
                padding: IconSizes.x00,
                borderColor: theme.placeholder,
                borderWidth: IconSizes.x00,
                borderRadius: 110,
              }}>
              <NativeImage uri={avatarData} style={styles(theme).avatarImage} />
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={loading}
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
                  size={IconSizes.x4}
                  color={ThemeStatic.white}
                />
              </TouchableOpacity>
            </View>
            <Header title="Welcome" />
            <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onNext}
                style={[styles(theme).button, styles(theme).buttonPrimary]}
                disabled={isLoading}>
                {isLoading ? (
                  <LoadingIndicator
                    size={IconSizes.x1}
                    color={ThemeStatic.white}
                  />
                ) : (
                  <>
                    <Text
                      style={[
                        {
                          ...FontWeights.Bold,
                          ...FontSizes.Body,
                          color: ThemeStatic.white,
                        },
                        styles(theme).centerText,
                      ]}>
                      Next
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={IconSizes.x6}
                      color={ThemeStatic.white}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
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
                  onPress={() => setAvatarData(null)}
                />
              </View>
            </Modalize>
          </View>
        ) : (
          <>
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
            <Header title="Password" />
            <Text
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Caption,
                  color: theme.text02,
                },
              ]}>
              Help secure your account
            </Text>
            <View style={[styles(theme).inputContainer, styles(theme).row]}>
              <Ionicons
                name="lock-closed-outline"
                size={IconSizes.x6}
                color={theme.text02}
              />
              <TextInput
                onChangeText={(text: string) => {
                  setPassword(text.trim());
                }}
                style={[
                  styles(theme).inputField,
                  {
                    ...FontWeights.Regular,
                    ...FontSizes.Body,
                    color: theme.text01,
                  },
                  {flex: 1},
                ]}
                autoFocus
                secureTextEntry={!isPasswordVisible}
                placeholder="Password"
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
                  setConfirmPassword(text.trim());
                }}
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
                placeholder="Confirm Password"
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
            <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={createAccount}
                style={[styles(theme).button, styles(theme).buttonPrimary]}
                disabled={loading}>
                {loading ? (
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
                    Create my account
                  </Text>
                )}
              </TouchableOpacity>
              {Object.values(validError).map(
                (errMessage: any, index: number) => (
                  <Text
                    key={index}
                    style={{
                      ...FontWeights.Regular,
                      ...FontSizes.Caption,
                      color: 'red',
                    }}>
                    {errMessage}
                  </Text>
                ),
              )}
            </View>
          </>
        )}
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
};

export default Password;
