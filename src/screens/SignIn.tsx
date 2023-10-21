import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
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
import {
  getSession,
  password as loginPassword,
} from '../reducers/action/authentications';
import {ILoginRequest} from '../models/request/ILoginRequest.model';
import {getHash} from '../utils/Crypto';
import {useAppDispatch} from '../reducers/redux/store';
import IconButton from '../components/control/IconButton';
import {authenticated} from '../reducers/redux/authentication.reducer';
import Header from '../components/header/Header';
import DeviceNumber from 'react-native-device-number';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: props) => {
  const dispatch = useAppDispatch();
  const {theme} = useContext(AppContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    DeviceNumber.get().then(({mobileNumber}) => {
      setUsername(mobileNumber.replace('+84', '0'));
    });
  }, []);

  const isValidData = () => {
    const error = checkEmpty(
      username,
      'Please enter your phone number or email address',
    );
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnUsernameChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    if (verify) {
      setUsername(text.trim());
    }
  };

  const handleOnPassChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    if (verify) {
      setPassword(text.trim());
    }
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        const body: ILoginRequest = {
          username: username,
          password: password,
          grant_type: 'password',
          client_secret: 'iW4rurIrZJ',
          hash: getHash('LOGIN'),
        };
        await loginPassword(body);
        dispatch(getSession());
        dispatch(authenticated());
      }  catch (err: any) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
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
      <KeyboardAvoidingView style={[{flex: 1}, space(IconSizes.x10).mt]}>
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
        <View style={[styles(theme).inputContainer]}>
          <TextInput
            value={username}
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
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
            <Text
              style={[
                styles(theme).centerText,
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  color: theme.accent,
                },
              ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles(theme).row, styles(theme).displayBottom]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[
              styles(theme).button,
              styles(theme).buttonPrimary,
              {flex: 1},
            ]}
            disabled={loading}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {}}
            style={[styles(theme).button, space(IconSizes.x5).ml]}
            disabled={loading}>
            <Ionicons
              name="finger-print"
              size={IconSizes.x9}
              color={theme.text01}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
