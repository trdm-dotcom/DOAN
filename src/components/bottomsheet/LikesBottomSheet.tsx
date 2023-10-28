import React, {Ref, forwardRef, useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {AppContext} from '../../context';
import {Modalize} from 'react-native-modalize';
import UserCard from '../user/UserCard';
import SvgBanner from '../SvgBanner';
import EmptyLikesBanner from '../../../assets/svg/empty-likes.svg';
import {FlatGrid} from 'react-native-super-grid';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {showError} from '../../utils/Toast';
import {styles} from '../style';
import {getReactionsOfPost} from '../../reducers/action/post';
import BottomSheetHeader from '../header/BottomSheetHeader';

interface LikesBottomSheetProps {
  ref: Ref<any>;
  postId: string;
  onUserPress: (userId: number) => void;
}

const LikesBottomSheet: React.FC<LikesBottomSheetProps> = forwardRef(
  ({postId, onUserPress}, ref) => {
    const {theme} = useContext(AppContext);
    const [users, setUsers] = useState<IUserInfoResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    let content = <ConnectionsPlaceholder />;

    useEffect(() => {
      setLoading(true);
      getReactionsOfPost({postId: postId})
        .then(res => setUsers(res))
        .catch((err: any) => {
          setError(true);
          showError(err.message);
        })
        .finally(() => setLoading(false));
    }, [postId]);

    const renderItem = ({item}) => {
      return (
        <UserCard
          userId={item.userId}
          avatar={item.avatar}
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
          ListEmptyComponent={() => (
            <SvgBanner
              Svg={EmptyLikesBanner}
              placeholder="No likes yet"
              spacing={16}
            />
          )}
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
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
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
