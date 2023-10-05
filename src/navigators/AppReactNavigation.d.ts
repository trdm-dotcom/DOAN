import {NavigationProp, ParamListBase} from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamListBase {}
  }
}

export function useAppNavigation<T extends NavigationProp>(): T;
