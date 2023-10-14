import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {AppContext} from '../../context';
import {Modalize} from 'react-native-modalize';
import UserCard from '../user/UserCard';
import SvgBanner from '../SvgBanner';
import BottomSheetHeader from './BottomSheetHeader';
import EmptyLikesBanner from '@app/assets/svg/empty-likes.svg';
import {FlatGrid} from 'react-native-super-grid';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {getUserInfo} from '../../reducers/action/user';
import {showError} from '../../utils/Toast';
import {styles} from '../style';

type LikesBottomSheetProps = {
  ref: React.Ref<any>;
  userIds: number[];
  onUserPress: (userId: number) => void;
};

const LikesBottomSheet: React.FC<LikesBottomSheetProps> = React.forwardRef(
  ({userIds, onUserPress}, ref) => {
    const {theme} = useContext(AppContext);
    const [users, setUsers] = useState<IUserInfoResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    let content = <ConnectionsPlaceholder />;

    useEffect(() => {
      setLoading(true);
      getUserInfo({userIds: userIds})
        .then(res => setUsers(res))
        .catch((err: any) => {
          setError(true);
          showError(err.message);
        })
        .finally(() => setLoading(false));
    }, [userIds]);

    const ListEmptyComponent = () => (
      <SvgBanner
        Svg={EmptyLikesBanner}
        placeholder="No likes yet"
        spacing={16}
      />
    );

    const renderItem = (item: any) => {
      return (
        <UserCard
          userId={item.id}
          avatar={item.avatar}
          handle={item.handle}
          name={item.name}
          onPress={() => onUserPress(item.id)}
        />
      );
    };

    if (!error && !loading) {
      content = (
        <FlatGrid
          bounces={false}
          itemDimension={responsiveWidth(85)}
          showsVerticalScrollIndicator={false}
          data={users}
          itemContainerStyle={styles().listItemContainer}
          contentContainerStyle={styles().listContentContainer}
          ListEmptyComponent={ListEmptyComponent}
          style={styles().listContainer}
          spacing={20}
          renderItem={renderItem}
        />
      );
    }

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}>
        <BottomSheetHeader
          heading="Likes"
          subHeading="Users who liked this post"
        />
        <View style={[styles(theme).modalizeContent]}>{content}</View>
      </Modalize>
    );
  },
);

export default LikesBottomSheet;
