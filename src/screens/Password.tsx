import React, {useContext, useRef, useState} from 'react';
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
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {IconSizes} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  register,
  password as loginPassword,
} from '../reducers/action/authentications';
import {useAppDispatch} from '../reducers/redux/store';
import HeaderBar from '../components/header/HeaderBar';
import {AppContext} from '../context';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Typography from '../theme/Typography';
import CheckBox from 'react-native-check-box';
import {
  authenticated,
  userInfo,
} from '../reducers/redux/authentication.reducer';
import Header from '../components/header/Header';
import IconButton from '../components/control/IconButton';
import ImagePicker from 'react-native-image-crop-picker';
import {getUserInfo, putUserInfo} from '../reducers/action/user';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {ThemeStatic} from '../theme/Colors';
import storage from '@react-native-firebase/storage';
import {BallIndicator} from 'react-native-indicators';
import AvatarOptionsBottomSheet from '../components/bottomsheet/AvatarOptionBottomSheet';
import {NativeImage} from '../components/shared/NativeImage';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Password'>;

const Password = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const dispatch = useAppDispatch();
  const {name, phoneNumber, mail, otpKey} = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<any>(undefined);

  const avatarOptionsBottomSheetRef = useRef();

  const isValidData = () => {
    const error =
      checkEmpty(password, 'Please enter your password') ||
      checkEmpty(confirmPassword, 'Please enter your confirm password') ||
      (password !== confirmPassword
        ? 'Password and confirm password do not match'
        : null);
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const createAccount = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        await register({
          username: phoneNumber,
          password: password,
          name: name,
          otpKey: otpKey,
          mail: mail,
          hash: getHash('REGISTER'),
        });
        setAccountCreated(true);
        await loginPassword({
          username: phoneNumber,
          password: password,
          grant_type: 'password',
          client_secret: 'iW4rurIrZJ',
          hash: getHash('LOGIN'),
        });
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
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
      setLoading(true);
      let avatar: any = null;
      if (avatarSrc != null) {
        avatar = await uploadImage(avatarSrc);
      }
      await putUserInfo({
        name: name,
        avatar: avatar,
      });
      const userInfoRes: IUserInfoResponse = await getUserInfo();
      dispatch(userInfo(userInfoRes));
      dispatch(authenticated());
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri.replace('file://', '');
    const imageRef = storage().ref(filename);
    await imageRef.putFile(uploadUri, {
      cacheControl: 'no-store', // disable caching
    });
    return imageRef.getDownloadURL();
  };

  const onOpenCamera = () => {
    closeOptions();
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        if (image && !Array.isArray(image)) {
          setAvatarSrc(image.path);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onOpenGallery = () => {
    closeOptions();
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        if (image && !Array.isArray(image)) {
          setAvatarSrc(image.path);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      {accountCreated ? (
        <>
          <HeaderBar
            contentLeft={
              <IconButton
                Icon={() => (
                  <Ionicons
                    name="chevron-back-outline"
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
            behavior={keyboardBehavior}
            keyboardVerticalOffset={20}
            style={[{flex: 1}, space(IconSizes.x10).mt]}>
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
              <TextInput
                onChangeText={(text: string) => {
                  const verify: boolean = text.trim().length > 0;
                  setIsContinue(verify);
                  if (verify) {
                    setPassword(text.trim());
                  }
                }}
                style={[
                  styles(theme).inputField,
                  {
                    ...FontWeights.Bold,
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
              <TextInput
                onChangeText={(text: string) => {
                  const verify: boolean = text.trim().length > 0;
                  setIsContinue(verify);
                  if (verify) {
                    setConfirmPassword(text.trim());
                  }
                }}
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
                placeholder="Confirm Password"
                placeholderTextColor={theme.text02}
              />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
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
              Your password must be at least 8 characters, at least one number
              and both lower and uppercase letters and special characters
            </Text>
            <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={createAccount}
                style={[styles(theme).button, styles(theme).buttonPrimary]}
                disabled={!isContinue || loading}>
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
            </View>
          </KeyboardAvoidingView>
        </>
      ) : (
        <View
          style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
          <View
            style={{
              padding: IconSizes.x00,
              borderColor: theme.placeholder,
              borderWidth: IconSizes.x00,
              borderRadius: 110,
            }}>
            <NativeImage uri={avatarSrc} style={styles(theme).avatarImage} />
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={loading}
              onPress={openOptions}
              style={{
                position: 'absolute',
                borderRadius: 100,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              {loading ? (
                <BallIndicator size={IconSizes.x8} color={theme.text01} />
              ) : (
                <Ionicons
                  name="camera"
                  size={IconSizes.x8}
                  color={theme.text01}
                />
              )}
            </TouchableOpacity>
          </View>
          <Header title="Welcome" />
          <View style={[space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onNext}
              style={[styles(theme).button, styles(theme).buttonPrimary]}
              disabled={!isContinue || loading}>
              {loading ? (
                <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
              ) : (
                <>
                  <Text
                    style={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: theme.text01,
                      },
                      styles(theme).centerText,
                    ]}>
                    Next
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={IconSizes.x6}
                    color={theme.text01}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
          <AvatarOptionsBottomSheet
            ref={avatarOptionsBottomSheetRef}
            onOpenCamera={onOpenCamera}
            onOpenGallery={onOpenGallery}
          />
        </View>
      )}
    </View>
  );
};

export default Password;
