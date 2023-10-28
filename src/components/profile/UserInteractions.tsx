import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeColors} from '../../constants/Types';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import LoadingIndicator from '../shared/LoadingIndicator';
import {IconSizes} from '../../constants/Constants';
import {useAppSelector} from '../../reducers/redux/store';
import {checkFriend} from '../../reducers/action/friend';
import {getConversationBetween} from '../../reducers/action/chat';

const {FontWeights, FontSizes} = Typography;

interface UserInteractionsProps {
  targetId: number;
  avatar: string;
  name: string;
}

const UserInteractions: React.FC<UserInteractionsProps> = ({
  targetId,
  avatar,
  name,
}) => {
  const navigation = useNavigation();
  const {theme} = useContext(AppContext);
  const user = useAppSelector(state => state.auth.userInfo);

  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Simulate the useQuery function with a setTimeout (you can replace this with your actual query)
    const fakeUseQuery = () => {
      setLoading(true);
      checkFriend({
        friend: targetId,
      })
        .then(res => setIsFriend(res.isFriend))
        .catch(err => {
          console.log(err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fakeUseQuery();
  }, [user.id, targetId]);

  let content =
    loading || error ? (
      <LoadingIndicator size={IconSizes.x0} color={theme.white} />
    ) : (
      <Text style={styles(theme).followInteractionText}>
        {`${isFriend ? 'UNFRIEND' : 'ADD FRIEND'}`}
      </Text>
    );

  const followInteraction = () => {};

  const messageInteraction = async () => {
    const conversation = await getConversationBetween({recipientId: targetId});
    navigation.navigate('Conversation', {
      chatId: conversation.chatId,
      avatar,
      name,
      targetId: targetId,
    });
  };

  return (
    <View style={styles().container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={followInteraction}
        style={styles(theme).followInteraction}>
        {content}
      </TouchableOpacity>
      {isFriend && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={messageInteraction}
          style={styles(theme).messageInteraction}>
          <Text style={styles(theme).messageInteractionText}>MESSAGE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    followInteraction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
      paddingVertical: 7,
      borderRadius: 40,
      backgroundColor: theme.accent,
    },
    messageInteraction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      paddingVertical: 7,
      borderRadius: 40,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.accent,
    },
    followInteractionText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.white,
    },
    messageInteractionText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.accent,
    },
  });

export default UserInteractions;
