/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import RootStack from './src/navigators/RootStack';
import { SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors, styles } from './src/components/style';
import { Provider } from 'react-redux';
import getStore, { useAppDispatch } from './src/reducers/store';
import { Init } from './src/reducers/authentications.reducer';

const store = getStore();

const Main = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  const init = async () => {
    await dispatch(Init());
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <RootStack />
    </Provider>
  );
};

export default Main;
