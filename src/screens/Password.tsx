import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TextInput,
} from 'react-native';
import {colors, styles} from '../components/style';
import {login} from '../reducers/authentications.reducer';
import {getHash} from '../utils/Crypto';
import {useAppDispatch} from '../reducers/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {PressableOpacity} from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'Password'>;

const Password = ({navigation, route}: props) => {
  const {createAccount, name, phoneNumber} = route.params;
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [isContinue, setIsContinue] = useState(false);

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

  const resetPassword = () => {};

  const handleContinue = () => {
    if (isValidData()) {
      if (createAccount) {
        navigation.navigate('Otp', {
          name: name,
          phoneNumber: phoneNumber,
          password: password,
        });
      } else {
        dispatch(
          login({
            username: phoneNumber,
            password: password,
            hash: getHash('LOGIN'),
            grant_type: 'password',
            client_secret: 'iW4rurIrZJ',
          }),
        );
      }
    }
  };

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          styles.alignItemsCenter,
          styles.justifyContentCenter,
        ]}>
        <Text style={[styles.boldText, styles.centerText, styles.h2]}>
          Choose your password
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            secureTextEntry
            textAlign="center"
            placeholder="Password"
            placeholderTextColor={colors.dark}
          />
        </View>
        {!createAccount && (
          <PressableOpacity onPress={resetPassword} style={[styles.buttonDark]}>
            <Text style={[styles.boldText, styles.centerText, styles.h4]}>
              Forget password
            </Text>
          </PressableOpacity>
        )}
        <View style={[styles.fullWidth, styles.displayBottom]}>
          <PressableOpacity
            onPress={handleContinue}
            style={[styles.buttonPrimary, styles.fullWidth]}
            disabled={!isContinue}
            disabledOpacity={0.4}>
            <Text style={[styles.boldText, styles.centerText, styles.h4]}>
              Continue
            </Text>
          </PressableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Password;
