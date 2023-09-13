import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { styles } from '../components/style';
import { RootStackParamList } from '../navigators/RootStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PressableOpacity } from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation}: props) => {
  const handlePress = (createAccount: boolean) => {
    console.log('createAccount', createAccount);
    navigation.navigate('Mail', {
      createAccount: createAccount,
    });
  };

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <View style={[styles.container, styles.alignItemsCenter, styles.justifyContentCenter]}>
        <View>
          
        </View>
        <View style={[styles.displayBottom, styles.fullWidth]}>
          <PressableOpacity
            style={[styles.buttonPrimary, styles.fullWidth, {marginBottom: 20}]}
            onPress={() => handlePress(true)}>
            <Text style={[styles.centerText, styles.boldText, styles.h4]}>Create account</Text>
          </PressableOpacity>
          <PressableOpacity
            style={[styles.buttonSecondary, styles.fullWidth]}
            onPress={() => handlePress(false)}>
            <Text style={[styles.centerText, styles.boldText, styles.h4]}>Sign in</Text>
          </PressableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Start;
