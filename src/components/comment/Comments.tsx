import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../context';
import CommentCard from './CommentCard';
import {Text, StyleSheet, View} from 'react-native';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {FlatGrid} from 'react-native-super-grid';
import {getCommentsOfPost} from '../../reducers/action/post';
import Modal from 'react-native-modal';
import AppButton from '../control/AppButton';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
const {FontWeights, FontSizes} = Typography;

type CommentsProps = {
  postId: string;
};

const Comments = ({postId}: CommentsProps) => {
  const {theme} = useContext(AppContext);
  const [comments, setComments] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentPressOption, setCommentPressOption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  const fetchComments = (post: string) => {
    setLoading(true);
    getCommentsOfPost({
      postId: post,
    })
      .then(response => {
        setComments([...comments, ...response]);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
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

  const modelToggle = () => {
    setShowModal(previousState => !previousState);
  };

  const toggleModal = (comment: any) => {
    setCommentPressOption(comment);
    setShowModal(true);
  };

  const onConfirm = () => {
    deleteComment(commentPressOption).then(() => {
      setShowModal(false);
      setComments(
        comments.filter(it => it.commentId !== commentPressOption.id),
      );
      setCommentPressOption(null);
    });
  };

  const deleteComment = async (comment: any) => {
    const newComments = comments.filter(it => it.commentId !== comment.id);
    setComments(newComments);
  };

  const ListHeaderComponent = () => (
    <Text style={[styles(theme).commentsHeader, {marginBottom}]}>Comments</Text>
  );

  let content =
    loading || error ? (
      <ConnectionsPlaceholder />
    ) : (
      <FlatGrid
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        data={comments}
        renderItem={renderItem}
        style={styles().listStyle}
        ListEmptyComponent={() => (
          <ListEmptyComponent
            placeholder="Be the first one to comment"
            placeholderStyle={styles().placeholderStyle}
            spacing={10}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    );

  const marginBottom = comments.length === 0 ? 0 : 20;

  return (
    <>
      {content}
      <Modal
        useNativeDriver
        animationInTiming={400}
        animationOutTiming={400}
        hideModalContentWhileAnimating
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => {
          modelToggle();
          setCommentPressOption(null);
        }}>
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
            label="Cancel"
            onPress={() => {
              modelToggle();
              setCommentPressOption(null);
            }}
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
