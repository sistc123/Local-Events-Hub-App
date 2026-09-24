import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import {
  RouteProp,
  useRoute,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { io, Socket } from "socket.io-client";

import { SOCKET_URL } from "../../constants/config";

import { getEventById } from "../../services/eventService";

import { createRSVP } from "../../services/rsvpService";

import {
  createComment,
  getComments,
} from "../../services/commentService";

import { Event } from "../../types/event";

import { Comment } from "../../types/comment";

import { useTheme } from "../../hooks/useTheme";

import Loading from "../../components/Loading";

import PrimaryButton from "../../components/PrimaryButton";

import CommentItem from "../../components/CommentItem";

type Params = {
  EventDetails: {
    eventId: number;
  };
};

const MAX_COMMENT_LENGTH = 500;

export default function EventDetailsScreen() {
  const theme = useTheme();

  const route =
    useRoute<
      RouteProp<
        Params,
        "EventDetails"
      >
    >();

  const { eventId } = route.params;

  const [event, setEvent] =
    useState<Event | null>(null);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [commentText, setCommentText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [commentsLoading, setCommentsLoading] =
    useState(true);

  const [rsvpLoading, setRsvpLoading] =
    useState(false);

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [socketConnected, setSocketConnected] =
    useState(false);

  /**
   * --------------------------------------------------
   * Load Event
   * --------------------------------------------------
   */

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);

      const result =
        await getEventById(eventId);

      setEvent(result);
    } catch (error: any) {
      console.log(
        "Event loading error:",
        error
      );

      Alert.alert(
        "Unable to Load Event",
        error?.response?.data?.message ||
          "The event could not be loaded. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  /**
   * --------------------------------------------------
   * Load Comments
   * --------------------------------------------------
   */

  const loadComments = useCallback(async () => {
    try {
      setCommentsLoading(true);

      const result =
        await getComments(eventId);

      setComments(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.log(
        "Comments loading error:",
        error
      );

      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [eventId]);

  /**
   * --------------------------------------------------
   * Initial Data Loading
   * --------------------------------------------------
   */

  useEffect(() => {
    loadEvent();
    loadComments();
  }, [
    loadEvent,
    loadComments,
  ]);

  /**
   * --------------------------------------------------
   * Socket.IO Real-Time Comments
   * --------------------------------------------------
   */

  useEffect(() => {
    let socket: Socket | null = null;

    try {
      socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      socket.on("connect", () => {
        console.log(
          "Socket connected:",
          socket?.id
        );

        setSocketConnected(true);

        socket?.emit(
          "join_event",
          eventId
        );
      });

      socket.on("disconnect", () => {
        console.log(
          "Socket disconnected."
        );

        setSocketConnected(false);
      });

      socket.on(
        "connect_error",
        (error) => {
          console.log(
            "Socket connection error:",
            error.message
          );

          setSocketConnected(false);
        }
      );

      socket.on(
        "new_comment",
        (newComment: Comment) => {
          if (!newComment) {
            return;
          }

          setComments((current) => {
            const alreadyExists =
              current.some(
                (item) =>
                  item.id ===
                  newComment.id
              );

            if (alreadyExists) {
              return current;
            }

            return [
              ...current,
              newComment,
            ];
          });
        }
      );
    } catch (error) {
      console.log(
        "Socket initialization error:",
        error
      );
    }

    return () => {
      if (socket) {
        socket.emit(
          "leave_event",
          eventId
        );

        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("new_comment");

        socket.disconnect();
      }
    };
  }, [eventId]);

  /**
   * --------------------------------------------------
   * RSVP
   * --------------------------------------------------
   */

  const handleRSVP = async () => {
    if (rsvpLoading) {
      return;
    }

    try {
      setRsvpLoading(true);

      await createRSVP(eventId);

      Alert.alert(
        "RSVP Successful",
        "You are now attending this event."
      );
    } catch (error: any) {
      console.log(
        "RSVP error:",
        error
      );

      Alert.alert(
        "RSVP Failed",
        error?.response?.data?.message ||
          "Unable to RSVP for this event."
      );
    } finally {
      setRsvpLoading(false);
    }
  };

  /**
   * --------------------------------------------------
   * Comment
   * --------------------------------------------------
   */

  const handleComment = async () => {
    const text =
      commentText.trim();

    if (!text) {
      Alert.alert(
        "Comment Required",
        "Please enter a comment before posting."
      );

      return;
    }

    if (
      text.length >
      MAX_COMMENT_LENGTH
    ) {
      Alert.alert(
        "Comment Too Long",
        `Comments must be ${MAX_COMMENT_LENGTH} characters or fewer.`
      );

      return;
    }

    if (commentLoading) {
      return;
    }

    try {
      setCommentLoading(true);

      await createComment(
        eventId,
        text
      );

      setCommentText("");

      /*
       * Reload comments as a fallback.
       *
       * Socket.IO should also deliver the
       * new comment in real time.
       */
      await loadComments();
    } catch (error: any) {
      console.log(
        "Comment creation error:",
        error
      );

      Alert.alert(
        "Comment Failed",
        error?.response?.data?.message ||
          "Unable to add your comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  /**
   * --------------------------------------------------
   * Map Coordinates
   * --------------------------------------------------
   */

  const mapCoordinates = useMemo(() => {
    if (!event) {
      return null;
    }

    const latitude =
      Number(event.latitude);

    const longitude =
      Number(event.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }, [event]);

  /**
   * --------------------------------------------------
   * Loading
   * --------------------------------------------------
   */

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <View
        style={[
          styles.errorContainer,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={52}
          color={theme.colors.danger}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          Event Unavailable
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                theme.colors.secondaryText,
            },
          ]}
        >
          We could not load this event.
        </Text>

        <View style={styles.retryButton}>
          <PrimaryButton
            title="Try Again"
            onPress={loadEvent}
          />
        </View>
      </View>
    );
  }

  /**
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <FlatList
        style={{
          backgroundColor:
            theme.colors.background,
        }}
        contentContainerStyle={
          styles.container
        }
        data={comments}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* -------------------------------- */}
            {/* Event Header */}
            {/* -------------------------------- */}

            <View
              style={[
                styles.headerCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor:
                      theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={
                    styles.categoryText
                  }
                >
                  {event.category ||
                    "EVENT"}
                </Text>
              </View>

              <Text
                style={[
                  styles.title,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                {event.title}
              </Text>

              {event.description ? (
                <Text
                  style={[
                    styles.description,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  {event.description}
                </Text>
              ) : null}
            </View>

            {/* -------------------------------- */}
            {/* Event Information */}
            {/* -------------------------------- */}

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <EventInfoRow
                icon="location-outline"
                label="Location"
                value={
                  event.location ||
                  "Location not available"
                }
                theme={theme}
              />

              <EventInfoRow
                icon="calendar-outline"
                label="Date"
                value={
                  event.event_date ||
                  "Date not available"
                }
                theme={theme}
              />

              <EventInfoRow
                icon="time-outline"
                label="Time"
                value={
                  event.event_time ||
                  "Time not available"
                }
                theme={theme}
              />
            </View>

            {/* -------------------------------- */}
            {/* Map */}
            {/* -------------------------------- */}

            {mapCoordinates ? (
              <View
                style={[
                  styles.mapCard,
                  {
                    backgroundColor:
                      theme.colors.surface,
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        theme.colors.text,
                    },
                  ]}
                >
                  Event Location
                </Text>

                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude:
                      mapCoordinates.latitude,
                    longitude:
                      mapCoordinates.longitude,
                    latitudeDelta:
                      0.01,
                    longitudeDelta:
                      0.01,
                  }}
                  showsUserLocation
                  showsMyLocationButton
                >
                  <Marker
                    coordinate={
                      mapCoordinates
                    }
                    title={event.title}
                    description={
                      event.location
                    }
                  />
                </MapView>
              </View>
            ) : (
              <View
                style={[
                  styles.noMapCard,
                  {
                    backgroundColor:
                      theme.colors.surface,
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={28}
                  color={
                    theme.colors.secondaryText
                  }
                />

                <Text
                  style={[
                    styles.noMapText,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  Map location is not
                  available for this event.
                </Text>
              </View>
            )}

            {/* -------------------------------- */}
            {/* RSVP */}
            {/* -------------------------------- */}

            <View
              style={[
                styles.rsvpCard,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <View
                style={styles.rsvpTextArea}
              >
                <Text
                  style={[
                    styles.rsvpTitle,
                    {
                      color:
                        theme.colors.text,
                    },
                  ]}
                >
                  Interested in this event?
                </Text>

                <Text
                  style={[
                    styles.rsvpDescription,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  RSVP to save your place.
                </Text>
              </View>

              <PrimaryButton
                title="RSVP to Event"
                onPress={handleRSVP}
                loading={rsvpLoading}
              />
            </View>

            {/* -------------------------------- */}
            {/* Comments Header */}
            {/* -------------------------------- */}

            <View
              style={styles.commentsHeader}
            >
              <View>
                <Text
                  style={[
                    styles.commentsTitle,
                    {
                      color:
                        theme.colors.text,
                    },
                  ]}
                >
                  Comments
                </Text>

                <Text
                  style={[
                    styles.commentsSubtitle,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  Join the conversation
                </Text>
              </View>

              <View
                style={[
                  styles.connectionStatus,
                  {
                    backgroundColor:
                      socketConnected
                        ? theme.colors.success
                        : theme.colors.secondaryText,
                  },
                ]}
              >
                <View
                  style={
                    styles.statusDot
                  }
                />

                <Text
                  style={
                    styles.connectionText
                  }
                >
                  {socketConnected
                    ? "Live"
                    : "Offline"}
                </Text>
              </View>
            </View>

            {/* -------------------------------- */}
            {/* Comment Input */}
            {/* -------------------------------- */}

            <View
              style={[
                styles.commentBox,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <TextInput
                value={commentText}
                onChangeText={(text) => {
                  if (
                    text.length <=
                    MAX_COMMENT_LENGTH
                  ) {
                    setCommentText(text);
                  }
                }}
                placeholder="Write a comment..."
                placeholderTextColor={
                  theme.colors.secondaryText
                }
                style={[
                  styles.commentInput,
                  {
                    backgroundColor:
                      theme.colors.input,
                    color:
                      theme.colors.text,
                    borderColor:
                      theme.colors.border,
                  },
                ]}
                multiline
                maxLength={
                  MAX_COMMENT_LENGTH
                }
                textAlignVertical="top"
              />

              <View
                style={
                  styles.commentFooter
                }
              >
                <Text
                  style={[
                    styles.characterCount,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  {commentText.length}/
                  {MAX_COMMENT_LENGTH}
                </Text>

                <Pressable
                  onPress={handleComment}
                  disabled={
                    commentLoading ||
                    !commentText.trim()
                  }
                  style={[
                    styles.postButton,
                    {
                      backgroundColor:
                        theme.colors.primary,

                      opacity:
                        commentLoading ||
                        !commentText.trim()
                          ? 0.5
                          : 1,
                    },
                  ]}
                >
                  {commentLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <Text
                        style={
                          styles.postButtonText
                        }
                      >
                        Post
                      </Text>

                      <Ionicons
                        name="send"
                        size={16}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            {/* -------------------------------- */}
            {/* Comments Loading */}
            {/* -------------------------------- */}

            {commentsLoading ? (
              <View
                style={
                  styles.commentsLoading
                }
              >
                <ActivityIndicator
                  size="small"
                  color={
                    theme.colors.primary
                  }
                />

                <Text
                  style={[
                    styles.loadingText,
                    {
                      color:
                        theme.colors.secondaryText,
                    },
                  ]}
                >
                  Loading comments...
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
          />
        )}
        ListEmptyComponent={
          !commentsLoading ? (
            <View
              style={[
                styles.emptyComments,
                {
                  backgroundColor:
                    theme.colors.surface,
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={34}
                color={
                  theme.colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                No comments yet
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      theme.colors.secondaryText,
                  },
                ]}
              >
                Be the first person to
                start the conversation.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footerSpace} />
        }
      />
    </KeyboardAvoidingView>
  );
}

/**
 * --------------------------------------------------
 * Event Information Row
 * --------------------------------------------------
 */

function EventInfoRow({
  icon,
  label,
  value,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: ReturnType<
    typeof useTheme
  >;
}) {
  return (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              theme.colors.input,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={theme.colors.primary}
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={[
            styles.infoLabel,
            {
              color:
                theme.colors.secondaryText,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/**
 * --------------------------------------------------
 * Styles
 * --------------------------------------------------
 */

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    container: {
      padding: 16,
      paddingBottom: 30,
    },

    headerCard: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
    },

    categoryBadge: {
      alignSelf: "flex-start",
      borderRadius: 8,
      paddingHorizontal: 11,
      paddingVertical: 6,
      marginBottom: 12,
    },

    categoryText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.5,
    },

    title: {
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "800",
      marginBottom: 12,
    },

    description: {
      fontSize: 15,
      lineHeight: 23,
    },

    infoCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    infoRowLast: {
      marginBottom: 0,
    },

    infoIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 3,
    },

    infoValue: {
      fontSize: 15,
      fontWeight: "600",
    },

    mapCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 12,
      marginBottom: 14,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "800",
      marginBottom: 10,
      paddingHorizontal: 3,
    },

    map: {
      width: "100%",
      height: 230,
      borderRadius: 14,
    },

    noMapCard: {
      minHeight: 100,
      borderWidth: 1,
      borderRadius: 18,
      padding: 18,
      marginBottom: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    noMapText: {
      marginTop: 8,
      fontSize: 13,
      textAlign: "center",
    },

    rsvpCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 20,
    },

    rsvpTextArea: {
      marginBottom: 12,
    },

    rsvpTitle: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 4,
    },

    rsvpDescription: {
      fontSize: 14,
    },

    commentsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    commentsTitle: {
      fontSize: 23,
      fontWeight: "800",
    },

    commentsSubtitle: {
      fontSize: 13,
      marginTop: 2,
    },

    connectionStatus: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#FFFFFF",
      marginRight: 5,
    },

    connectionText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "700",
    },

    commentBox: {
      borderWidth: 1,
      borderRadius: 16,
      padding: 12,
      marginBottom: 16,
    },

    commentInput: {
      minHeight: 90,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 13,
      paddingVertical: 11,
      fontSize: 14,
    },

    commentFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },

    characterCount: {
      fontSize: 11,
    },

    postButton: {
      minWidth: 80,
      minHeight: 40,
      borderRadius: 10,
      paddingHorizontal: 13,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    postButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
    },

    commentsLoading: {
      minHeight: 70,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },

    loadingText: {
      fontSize: 13,
    },

    emptyComments: {
      minHeight: 150,
      borderWidth: 1,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginTop: 5,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginTop: 10,
    },

    emptyText: {
      fontSize: 13,
      textAlign: "center",
      marginTop: 5,
      lineHeight: 19,
    },

    footerSpace: {
      height: 30,
    },

    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
    },

    errorTitle: {
      fontSize: 22,
      fontWeight: "800",
      marginTop: 15,
    },

    errorText: {
      fontSize: 14,
      marginTop: 7,
      textAlign: "center",
    },

    retryButton: {
      marginTop: 20,
      minWidth: 150,
    },
  });