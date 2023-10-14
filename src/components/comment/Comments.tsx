import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../context';
import CommentCard from './CommentCard';
import {Text, StyleSheet, View} from 'react-native';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {FlatGrid} from 'react-native-super-grid';
import {getCommentsOfPost} from '../../reducers/action/post';
import {Pagination} from '../../constants/Constants';
import Modal from 'react-native-modal';
import AppButton from '../control/AppButton';
const {FontWeights, FontSizes} = Typography;

type CommentsProps = {
  postId: string;
};

const Comments = ({postId}: CommentsProps) => {
  const {theme} = useContext(AppContext);
  const [comments, setComments] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [commentPressOption, setCommentPressOption] = useState<any>(null);

  useEffect(() => {
    fetchComments(postId, pageNumber);
  }, [postId, pageNumber]);

  const fetchComments = async (post: string, page: number) => {
    const response = await getCommentsOfPost(post, {
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setComments(response);
  };

  const renderItem = (item: any) => {
    return (
      <CommentCard
        userId={item.userId}
        avatar={item.avatar}
        name={item.name}
        comment={item.comment}
        time={item.createdAt}
        onPressOption={() => toggleModal(item)}
      />
    );
  };

  const toggleModal = (comment: any) => {
    setCommentPressOption(comment);
    setShowModal(previousState => !previousState);
  };

  const onConfirm = async () => {
    await deleteComment(commentPressOption);
    setShowModal(false);
  };

  const deleteComment = async (comment: any) => {
    const newComments = comments.filter(it => it.commentId !== comment.id);
    setComments(newComments);
  };

  const onReport = async () => {
    await reportComment(commentPressOption);
    setShowModal(false);
  };

  const reportComment = (comment: any) => {
    
  };

  const ListHeaderComponent = () => (
    <Text style={[styles(theme).commentsHeader, {marginBottom}]}>Comments</Text>
  );

  const marginBottom = comments.length === 0 ? 0 : 20;

  return (
    <>
      <FlatGrid
        bounces={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        data={comments}
        renderItem={renderItem}
        style={styles().listStyle}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <ListEmptyComponent
            placeholder="Be the first one to comment"
            placeholderStyle={styles().placeholderStyle}
            spacing={10}
          />
        )}
      />
      <Modal
        useNativeDriver
        animationInTiming={400}
        animationOutTiming={400}
        hideModalContentWhileAnimating
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={toggle}>
        <View
          style={[
            {
              padding: 20,
              borderRadius: 10,
              backgroundColor: theme.base,
            },
          ]}>
          <AppButton
            label={'Delete'}
            onPress={onConfirm}
            loading={false}
            containerStyle={[
              {marginTop: 10},
              {backgroundColor: theme.placeholder},
            ]}
          />
          <AppButton
            label={'Report'}
            onPress={onReport}
            loading={false}
            containerStyle={[
              {marginTop: 10},
              {backgroundColor: theme.placeholder},
            ]}
          />
          <AppButton
            label="Cancel"
            onPress={toggle}
            loading={false}
            labelStyle={{color: theme.text02}}
            containerStyle={[
              {marginTop: 10},
              {backgroundColor: theme.placeholder},
            ]}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    commentsHeader: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
    listStyle: {
      marginBottom: 10,
    },
    placeholderStyle: {
      ...FontSizes.Body,
    },
  });

export default Comments;
