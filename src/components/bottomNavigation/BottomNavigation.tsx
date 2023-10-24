import React, {useContext} from 'react';
import {View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {AppContext} from '../../context';
import {IconSizes} from '../../constants/Constants';

const Bottomnavbar = ({navigation, page}) => {
  const {theme} = useContext(AppContext);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: theme.placeholder,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 100,
        paddingVertical: 10,
        alignItems: 'center',
      }}>
      {page === 'Feed' ? (
        <Feather
          name="home"
          size={IconSizes.x6}
          color="black"
          style={{
            backgroundColor: theme.text01,
            borderRadius: 50,
            padding: 10,
          }}
          onPress={() => navigation.navigate('Feed')}
        />
      ) : (
        <Feather
          name="home"
          size={IconSizes.x6}
          color="black"
          style={{
            color: 'white',
          }}
          onPress={() => navigation.navigate('Feed')}
        />
      )}

      {page === 'Notifi' ? (
        <Feather
          name="bell"
          size={IconSizes.x6}
          color="black"
          style={{
            backgroundColor: theme.text01,
            borderRadius: 50,
            padding: 10,
          }}
          onPress={() => navigation.navigate('Notifi')}
        />
      ) : (
        <Feather
          name="bell"
          size={IconSizes.x6}
          color="black"
          style={{
            color: 'white',
          }}
          onPress={() => navigation.navigate('Notifi')}
        />
      )}

      {page === 'Friend' ? (
        <Feather
          name="users"
          size={IconSizes.x6}
          color="black"
          style={{
            backgroundColor: theme.text01,
            borderRadius: 50,
            padding: 10,
          }}
          onPress={() => navigation.navigate('Friend')}
        />
      ) : (
        <Feather
          name="users"
          size={IconSizes.x6}
          color="black"
          style={{
            color: 'white',
          }}
          onPress={() => navigation.navigate('Friend')}
        />
      )}
      {page === 'Setting' ? (
        <Feather
          name="user"
          size={IconSizes.x6}
          color="black"
          style={{
            backgroundColor: theme.text01,
            borderRadius: 50,
            padding: 10,
          }}
          onPress={() => navigation.navigate('Setting')}
        />
      ) : (
        <Feather
          name="user"
          size={IconSizes.x6}
          color="black"
          style={{
            color: 'white',
          }}
          onPress={() => navigation.navigate('Setting')}
        />
      )}
    </View>
  );
};

export default Bottomnavbar;
