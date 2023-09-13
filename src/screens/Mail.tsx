import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TextInput,
} from 'react-native';
import {colors, styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {PressableOpacity} from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'Mail'>;

const Mail = ({navigation, route}: props) => {
  const {createAccount} = route.params;
  const [mail, setMail] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  const isValidData = () => {
    const error = checkEmpty(mail, 'Please enter your email');
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
      setMail(text.trim());
    }
  };

  const handleContinue = () => {
    if (isValidData()) {
      if (createAccount) {
        navigation.navigate('PhoneNumber', {
          createAccount: createAccount,
          mail: mail,
        });
      } else {
        navigation.navigate('Password', {
          createAccount: createAccount,
          mail: mail,
        });
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
        <Text style={[styles.boldText, styles.h2]}>What's your email?</Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            textAlign="center"
            placeholder="Your email"
            placeholderTextColor={colors.dark}
          />
        </View>
        {!createAccount && (
          <PressableOpacity
            onPress={() =>
              navigation.replace('PhoneNumber', {
                createAccount: createAccount,
              })
            }
            style={[styles.buttonDark]}>
            <Text style={[styles.boldText, styles.centerText, styles.h4]}>
              Use phone instead
            </Text>
          </PressableOpacity>
        )}
        <View
          style={[
            styles.fullWidth,
            styles.displayBottom,
            styles.alignItemsCenter,
          ]}>
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

export default Mail;
