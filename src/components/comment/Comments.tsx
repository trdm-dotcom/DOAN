import React, {useContext, useState} from 'react';
import {AppContext} from '../../context';
import CommentCard from './CommentCard';
import {Text, StyleSheet} from 'react-native';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {deleteComment} from '../../reducers/action/post';
import {showError} from '../../utils/Toast';
import ConfirmationModal from '../shared/ConfirmationModal';
import {sortCommentDescendingTime} from '../../utils/shared';
const {FontWeights, FontSizes} = Typography;

type CommentsProps = {
  comments: any[];
  postId: string;
};

const Comments = ({comments, postId}: CommentsProps) => {
  const {theme} = useContext(AppContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentPressOption, setCommentPressOption] = useState<any>(null);

  const toggleModal = (comment: any) => {
    setCommentPressOption(comment);
    setShowModal(true);
  };

  const onConfirm = () => {
    setShowModal(false);
    deleteComment({postId: postId, commentId: commentPressOption.id})
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

  return (
    <>
      <Text style={[styles(theme).commentsHeader, {marginBottom: 20}]}>
        Comments
      </Text>
      {sortCommentDescendingTime(comments).map(comment => {
        return (
          <CommentCard
            key={comment.id}
            userId={comment.userId}
            avatar={comment.avatar}
            name={comment.name}
            comment={comment.comment}
            time={comment.createdAt}
            onPressOption={() => toggleModal(comment)}
          />
        );
      })}
      <ConfirmationModal
        label="Delete"
        title="Delete this comment?"
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
