import React from 'react';
import {SafeAreaView, View, Text, TextInput} from 'react-native';
import {styles} from '../components/style';
import {useAppDispatch, useAppSelector} from '../reducers/store';
import {searchUser} from '../reducers/user.reducer';

const Friends = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.friend.loading);

  const handleOnChangeText = (text: string) => {
    if (text.trim().length > 0) {
      dispatch(searchUser(text.trim()));
    }
  };

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <View style={styles.container}>
        <Text style={[styles.boldText, styles.h2, styles.centerText]}>
          Your Friends
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h3]}
            editable={!loading}
            textAlign="center"
            placeholder="Add a new friend"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Friends;
