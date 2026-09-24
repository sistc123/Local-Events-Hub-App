import React from "react";

import {
  StyleSheet,
  Text,
  View
} from "react-native";

import { Comment } from "../types/comment";

import { useTheme } from "../hooks/useTheme";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<
  CommentItemProps
> = ({ comment }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.surface,
          borderColor:
            theme.colors.border
        }
      ]}
    >
      <Text
        style={[
          styles.userName,
          {
            color:
              theme.colors.text
          }
        ]}
      >
        {comment.user_name}
      </Text>

      <Text
        style={[
          styles.comment,
          {
            color:
              theme.colors.text
          }
        ]}
      >
        {comment.comment}
      </Text>

      <Text
        style={[
          styles.date,
          {
            color:
              theme.colors.secondaryText
          }
        ]}
      >
        {new Date(
          comment.created_at
        ).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },

  userName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5
  },

  comment: {
    fontSize: 14,
    lineHeight: 20
  },

  date: {
    fontSize: 11,
    marginTop: 7
  }
});

export default CommentItem;