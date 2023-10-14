import React, {useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {space, styles} from '../components/style';
import {getHash} from '../utils/Crypto';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {IconSizes} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {register} from '../reducers/action/authentications';
import {useAppDispatch} from '../reducers/redux/store';
import HeaderBar from '../components/header/HeaderBar';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {AppContext} from '../context';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Typography from '../theme/Typography';
import CheckBox from 'react-native-check-box';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Password'>;

const Password = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const dispatch = useAppDispatch();
  const {name, phoneNumber, mail, otpKey} = route.params;
  const [password, setPassword] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidData = () => {
    const error = checkEmpty(password, 'Please enter your password');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    setIsContinue(verify);
    if (verify) {
      setPassword(text.trim());
    }
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        dispatch(
          register({
            username: phoneNumber,
            password: password,
            name: name,
            otpKey: otpKey,
            mail: mail,
            hash: getHash('REGISTER'),
          }),
        );
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View style={{height: 24}}>
        <HeaderBar
          firstChilden={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            </TouchableOpacity>
          }
        />
      </View>
      <KeyboardAvoidingView
        style={[styles(theme).container, space(IconSizes.x10).mt]}>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.SubHeading,
              color: theme.text01,
            },
          ]}>
          Password
        </Text>
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
            onChangeText={handleOnChangeText}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
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
            onChangeText={handleOnChangeText}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
              },
              {flex: 1},
            ]}
            autoFocus
            secureTextEntry={!isPasswordVisible}
            placeholder="Confirm Password"
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
                ...FontSizes.Body, // Add some margin for spacing
              },
              {color: theme.text01},
              space(IconSizes.x1).mr,
            ]}
          />
        </View>
        <View
          style={[
            {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'},
            space(IconSizes.x5).mt,
          ]}>
          <PressableOpacity
            onPress={handleContinue}
            style={[styles(theme).button, styles(theme).buttonPrimary]}
            disabled={!isContinue || loading}
            disabledOpacity={0.4}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
            ) : (
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                  },
                ]}>
                Create my account
              </Text>
            )}
          </PressableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Password;
