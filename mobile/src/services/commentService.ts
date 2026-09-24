import api from "./api";

import { Comment } from "../types/comment";

export const getComments = async (
  eventId: number
): Promise<Comment[]> => {
  console.log(
    "GET COMMENTS:",
    `/events/${eventId}/comments`
  );

  const response = await api.get<{
    success: boolean;
    comments: Comment[];
  }>(
    `/events/${eventId}/comments`
  );

  console.log(
    "GET COMMENTS RESPONSE:",
    response.status,
    response.data
  );

  return Array.isArray(response.data?.comments)
    ? response.data.comments
    : [];
};

export const createComment = async (
  eventId: number,
  comment: string
): Promise<Comment> => {
  console.log(
    "CREATE COMMENT:",
    `/events/${eventId}/comments`
  );

  const response = await api.post<{
    success: boolean;
    comment: Comment;
  }>(
    `/events/${eventId}/comments`,
    {
      comment: comment.trim(),
    }
  );

  console.log(
    "CREATE COMMENT RESPONSE:",
    response.status,
    response.data
  );

  return response.data.comment;
};