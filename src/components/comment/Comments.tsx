import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../context';
import CommentCard from './CommentCard';
import {Text, StyleSheet} from 'react-native';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {deleteComment, getCommentsOfPost} from '../../reducers/action/post';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {showError} from '../../utils/Toast';
import ConfirmationModal from '../shared/ConfirmationModal';
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
  }, []);

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

  const toggleModal = (comment: any) => {
    setCommentPressOption(comment);
    setShowModal(true);
  };

  const onConfirm = () => {
    setShowModal(false);
    deleteComment({postId: postId, commentId: commentPressOption.id})
      .then(() => {
        setComments(
          comments.filter(comment => comment.id !== commentPressOption.id),
        );
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => {
        setCommentPressOption(null);
      });
  };

  const deleteConfirmationToggle = () => {
    setShowModal(previousState => !previousState);
    setCommentPressOption(null);
  };

  let content =
    loading || error ? (
      <ConnectionsPlaceholder />
    ) : comments.length > 0 ? (
      comments.map(comment => {
        return (
          <CommentCard
            userId={comment.userId}
            avatar={comment.avatar}
            name={comment.name}
            comment={comment.comment}
            time={comment.createdAt}
            onPressOption={() => toggleModal(comment)}
          />
        );
      })
    ) : (
      <ListEmptyComponent
        placeholder="Be the first one to comment"
        placeholderStyle={styles().placeholderStyle}
        spacing={10}
      />
    );

  const marginBottom = comments.length === 0 ? 0 : 20;

  return (
    <>
      <Text style={[styles(theme).commentsHeader, {marginBottom}]}>
        Comments
      </Text>
      {content}
      <ConfirmationModal
        label="Delete"
        title="Are you sure you want to delete this comment?"
        color="red"
        isVisible={showModal}
        toggle={deleteConfirmationToggle}
        onConfirm={onConfirm}
      />
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
