import React, {Ref, forwardRef, useContext, useState} from 'react';
import {AppContext} from '../../context';
import {Modalize} from 'react-native-modalize';
import UserCard from '../user/UserCard';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {showError} from '../../utils/Toast';
import {space, styles} from '../style';
import {getReactionsOfPost} from '../../reducers/action/post';
import BottomSheetHeader from '../header/BottomSheetHeader';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {IconSizes} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

interface LikesBottomSheetProps {
  ref: Ref<any>;
  postId: string;
}

const LikesBottomSheet: React.FC<LikesBottomSheetProps> = forwardRef(
  ({postId}, ref) => {
    const {theme} = useContext(AppContext);
    const navigation = useNavigation();
    const [users, setUsers] = useState<IUserInfoResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const {user} = useSelector((state: any) => state.user);

    const renderItem = ({item}) => {
      return (
        <UserCard
          userId={item.id}
          avatar={item.avatar}
          name={item.name}
          onPress={event => {
            event.persist(); // Duỵ trì sự kiện gốc
            if (item.id !== user.id) {
              navigation.navigate('Profile', {userId: item.id});
            }
          }}
          style={[space(IconSizes.x1).mt]}
        />
      );
    };

    const handleOpen = () => {
      setLoading(true);
      getReactionsOfPost({postId: postId})
        .then(res => setUsers(res))
        .catch((err: any) => {
          setError(true);
          showError(err.message);
        })
        .finally(() => setLoading(false));
    };

    return (
      <Modalize
        ref={ref}
        modalStyle={[styles(theme).modalizeContainer]}
        onOpen={handleOpen}
        HeaderComponent={
          <BottomSheetHeader
            heading="Likes"
            subHeading="Users who liked this post"
          />
        }
        flatListProps={{
          data: users,
          renderItem: renderItem,
          keyExtractor: item => item.id,
          showsVerticalScrollIndicator: false,
          ListEmptyComponent: () =>
            loading || error ? (
              <ConnectionsPlaceholder />
            ) : (
              <ListEmptyComponent listType="likes" spacing={30} />
            ),
        }}
        adjustToContentHeight
      />
    );
  },
);

export default LikesBottomSheet;
