import React, {useContext} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import {ThemeStatic} from '../../theme/Colors';
import Option from '../shared/Option';
import {styles} from '../style';
import {useSelector} from 'react-redux';

interface PostOptionsBottomSheetProps {
  ref: React.Ref<any>;
  post: any;
  friendStatus: any;
  onPostEdit: () => void;
  onPostDelete: () => void;
  onPostDiable: () => void;
  onPostUnDiable: () => void;
  onReportPost: () => void;
  onUnfriend: () => void;
  onBlock: () => void;
}

const PostOptionsBottomSheet: React.FC<PostOptionsBottomSheetProps> =
  React.forwardRef(
    (
      {
        post,
        friendStatus,
        onPostEdit,
        onPostDelete,
        onPostDiable,
        onPostUnDiable,
        onReportPost,
        onUnfriend,
        onBlock,
      },
      ref,
    ) => {
      const {theme} = useContext(AppContext);
      const {user} = useSelector((state: any) => state.user);

      const isOwnPost = user.id === post.author!.id;

      let content = (
        <>
          {friendStatus.status === 'FRIENDED' && (
            <Option
              label="Unfriend"
              iconName="person-remove-outline"
              onPress={onUnfriend}
            />
          )}
          <Option label="Block" iconName="ban-outline" onPress={onBlock} />
          <Option
            label="Report"
            iconName="alert-circle-outline"
            color={ThemeStatic.delete}
            onPress={onReportPost}
          />
        </>
      );

      if (isOwnPost) {
        content = (
          <>
            <Option
              label="Edit"
              iconName="create-outline"
              onPress={onPostEdit}
            />
            {post.disable ? (
              <Option
                label="Unhide"
                iconName="eye-outline"
                onPress={onPostUnDiable}
              />
            ) : (
              <Option
                label="Hide"
                iconName="eye-off-outline"
                onPress={onPostDiable}
              />
            )}
            <Option
              label="Delete"
              iconName="trash-outline"
              color={ThemeStatic.delete}
              onPress={onPostDelete}
            />
          </>
        );
      }

      return (
        <Modalize
          //@ts-ignore
          ref={ref}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          modalStyle={[styles(theme).modalizeContainer]}
          adjustToContentHeight>
          <View
            style={[
              {
                flex: 1,
                paddingTop: 20,
                paddingBottom: 16,
              },
            ]}>
            {content}
          </View>
        </Modalize>
      );
    },
  );

export default PostOptionsBottomSheet;
