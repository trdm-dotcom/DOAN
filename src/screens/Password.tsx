import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Text,
  View,
  Pressable,
} from 'react-native';
import {styles} from '../components/style';
import { login } from '../reducers/authentications.reducer';
import { getHash } from '../utils/Crypto';
import { useAppDispatch } from '../reducers/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootStack';
import { checkEmpty } from '../utils/Validate';
import { showError } from '../utils/Toast';

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
    if (verify){
      setPassword(text.trim());
    }
  };

  const handleContinue = () => {
    if (isValidData()) {
      if (createAccount) {
        navigation.navigate('Otp', {
          name: name,
          phoneNumber: phoneNumber,
          password: password,
        });
      }
      else {
        dispatch(login({username: phoneNumber, password: password, hash: getHash('LOGIN')}));
      }
    }
  };

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.topText, styles.boldText, styles.h2]}>
            DOAN.
          </Text>
          <Text style={[styles.boldText, styles.centerText, styles.h2]}>
            Enter your's password
          </Text>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            secureTextEntry
            textAlign="center"
            placeholder="Password"
          />
          <View style={[styles.fullWidthButton, styles.bottomButton]}>
            <Pressable
              onPress={handleContinue}
              style={styles.buttonPrimary}
              disabled={!isContinue}>
              <Text style={[styles.boldText, styles.centerText, styles.h3]}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Password;
