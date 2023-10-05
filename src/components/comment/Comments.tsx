/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {AppContext} from '../../context';
import CommentCard from './CommentCard';
import {Text, StyleSheet} from 'react-native';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {FlatGrid} from 'react-native-super-grid';
const {FontWeights, FontSizes} = Typography;

type CommentsProps = {
  postId: string;
  comments: any[];
};

const Comments = ({postId, comments}: CommentsProps) => {
  const {theme} = useContext(AppContext);

  const renderItem = ({item}: any) => {
    const {
      id: commentId,
      author: {id: authorId, avatar, handle},
      body,
      createdAt,
    } = item;

    return (
      <CommentCard
        postId={postId}
        commentId={commentId}
        authorId={authorId}
        avatar={avatar}
        handle={handle}
        body={body}
        time={createdAt}
      />
    );
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
        ListEmptyComponent={() => (
          <ListEmptyComponent
            placeholder="Be the first one to comment"
            placeholderStyle={styles().placeholderStyle}
            spacing={10}
          />
        )}
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
