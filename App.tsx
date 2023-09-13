import React from 'react';
import RootStack from './src/navigators/RootStack';
import { Provider } from 'react-redux';
import getStore from './src/reducers/store';
import { clearAuthentication } from './src/reducers/authentications.reducer';
import { bindActionCreators } from 'redux';
import { setupAxiosInterceptors } from './src/utils/Api';

const Main = () => {
  const store = getStore();

  const actions = bindActionCreators({ clearAuthentication }, store.dispatch);

  setupAxiosInterceptors(() => actions.clearAuthentication());

  return (
    <Provider store={store}>
      <RootStack />
    </Provider>
  );
};

export default Main;
