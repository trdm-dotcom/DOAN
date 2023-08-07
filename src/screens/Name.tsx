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

const Name = () => {
  const FULLNAME_REGEX = new RegExp(
    '^(?<!\\.)[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹs]*$(?<!\\.)'
  );
  const [name, setName] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  const handleOnChangeText = (text: string) => {
    const isVerified = text.length > 0 && FULLNAME_REGEX.test(text);
    setIsContinue(isVerified);
  };

  const handleContinue = () => {};

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.topText, styles.boldText, styles.h2]}>
            DOAN.
          </Text>
          <Text style={[styles.boldText, styles.centerText, styles.h2]}>
            What's your name?
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={handleOnChangeText}
              style={[styles.inputField, styles.boldText, styles.h2]}
              autoFocus
              textAlign="center"
              placeholder="Your name"
            />
          </View>
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

export default Name;
