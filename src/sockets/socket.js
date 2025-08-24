const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");
const ChatMemberModel = require("../models/chatMemberModel");
const MessageModel = require("../models/messageModel");
const ReactionStatus = require("../models/reactionStatusModel");
// const { InMemorySessionStore } = require("../config/sessionStore");
// const sessionStore = new InMemorySessionStore();
const onlineUsers = new Map();
const chatOpenStatuses = new Map();
// const privateChat = require("../sockets/privateChat");
const { generateHash, updateAndReturnIds } = require("../utils/usefulFunction");

/**
 * @param {import("socket.io").Server} io - The Socket.IO server instance
 */

module.exports = function (io) {
  // io.use((socket, next) => {
  //   const sessionID = socket.handshake.auth.sessionID;
  //   if (sessionID) {
  //     // find existing session
  //     const session = sessionStore.findSession(sessionID);
  //     if (session) {
  //       socket.sessionID = sessionID;
  //       socket.userID = session.userID;
  //       return next();
  //     }
  //   }
  //   // create new session
  //   socket.sessionID = randomId();
  //   socket.userID = randomId();
  //   next();
  // });

  io.on("connection", function (socket) {
    // const ipAddress = socket.handshake.address;
    console.log(socket.id, "- new connected socket");
    // console.log(socket.handshake, "- handshake");
    // console.log(ipAddress);

    socket.on("initial_access", async (data, callback) => {
      const { userId } = data;
      try {
        if (!userId) return;

        onlineUsers.set(userId, {
          user_id: userId,
          socket_id: socket.id,
          is_online: true,
        });

        const communicatedChatIds = await ChatModel.find(
          {
            chat_type: "private",
            participant_ids: { $in: userId },
          },
          { _id: 1 }
        ).exec();

        const subscribedGroupChannelIds = await ChatMemberModel.find(
          {
            user_id: userId,
          },
          { chat_id: 1 }
        ).exec();

        // Join rooms in batch
        const roomIds = [
          ...new Set(
            communicatedChatIds
              .concat(subscribedGroupChannelIds)
              .map(({ _id }) => _id?.toString())
          ), // used Set to ensure unique ids
        ];

        socket.join(roomIds);

        console.log(onlineUsers, "- onlineUsers");

        return callback({
          success: true,
          description: "All user's chats joined",
        });
      } catch (err) {
        console.log(err, "- error on initial_access");
      }
    });

    socket.on("private_message", async function (data, callback) {
      const {
        senderId,
        receiverId,
        text,
        replyToMessageId,
        sharedLocation,
        reactionCount,
        messageId,
        editIntent, // true > user wants to edit something on message
        action, // received when user wants to pin some message or something like that
      } = data;
      if (
        senderId?.trim() === "" ||
        !senderId ||
        receiverId?.trim() === "" ||
        !receiverId
      ) {
        callback({
          status: 400,
          message: "Sender or receiver identifiers required !",
        });
        return;
        // console.log("Sender or receiver identifiers required !");
      }

      // Trim message text to avoid sending empty messages
      if (text?.trim() === "") {
        callback({ status: 400, message: "Text required!" });
        return;
        // console.log("Text required!");
      }
      try {
        // const { user } = socket.handshake.session;
        const chat = await ChatModel.findOne(
          {
            chat_type: "private",
            participant_ids: { $all: [senderId, receiverId] },
          },
          { _id: 1 }
        );

        if (editIntent && chat && messageId) {
          // when user wants to update specified message
          let query = { _id: messageId };
          let updateFields = { is_edited: true };

          // when user wants to interact (reaction) with specified message
          if (reactionCount) {
            const reactionStatusDoc = await ReactionStatus.findOne({
              message_id: messageId,
              user_id: senderId,
              emoji: reactionCount?.emoji,
            }).select("-createdAt -updatedAt");

            const incrementValue = reactionStatusDoc ? -1 : 1;

            query = {
              ...query,
              $or: [
                { [`reaction_counts.${reactionCount?.emoji}`]: { $gt: 0 } }, // ensure the value is greater than 0
                {
                  [`reaction_counts.${reactionCount?.emoji}`]: {
                    $exists: false,
                  },
                }, // allow if it doesn't exist
              ],
            };

            updateFields = {
              ...updateFields,
              $inc: {
                [`reaction_counts.${reactionCount?.emoji}`]: incrementValue,
              },
            };
          }

          if (text) {
            updateFields.text = text;
          }

          const updatedMessage = await MessageModel.findOneAndUpdate(
            { _id: messageId },
            updateFields,
            { new: true }
          ).populate("replied_to", "first_name text");

          return io.to(chat._id?.toString()).emit("private_message", {
            ...updatedMessage?.toObject(),
            is_edited_success: true, // informing users that message edited successfully
          });
        }

        let messageType;

        if (sharedLocation) {
          messageType = "shared_location";
        }

        const newMessage = new MessageModel({
          sender_id: senderId,
          receiver_id: receiverId,
          chat_id: chat?._id,
          message_type: messageType || "text",
          text: text || undefined,
          replied_to: replyToMessageId || undefined,
          shared_location: sharedLocation || undefined,
          is_edited: false,
          is_read: false,
        });

        if (chat) {
          // when sent message on exist chat (communicated before)
          const receiverOnChat = chatOpenStatuses.get(
            newMessage?.receiver_id?.toString()
          );

          if (receiverOnChat?.chat_id == chat?._id?.toString()) {
            // if chat's open on receiver
            newMessage.is_read = true; // marking message as read
            const savedMessage = await newMessage.save();

            await savedMessage.populate([
              // { path: "sender_id", select: "accent_color" },
              // { path: "receiver_id", select: "accent_color" },
              { path: "replied_to", select: "first_name text" },
            ]);

            // const unreadMessagesCount = await MessageModel.countDocuments({
            //   chat_id: chat?._id,
            //   receiver_id: receiverId,
            //   is_read: false,
            // });

            io.to(chat._id?.toString()).emit("private_message", {
              ...savedMessage.toObject(),
              // unread_details: {
              //   user_id: receiverId,
              //   unread_count: unreadMessagesCount,
              // },
            });
          } else {
            // if chat's NOT open on receiver, remaining message as unread
            const savedMessage = await newMessage.save();

            await savedMessage.populate([
              // { path: "sender_id", select: "first_name accent_color" },
              // { path: "receiver_id", select: "first_name accent_color" },
              { path: "replied_to", select: "first_name text" },
            ]);

            const unreadMessagesCount = await MessageModel.countDocuments({
              chat_id: chat?._id,
              receiver_id: receiverId,
              is_read: false,
            });

            io.to(chat._id.toString()).emit("private_message", {
              ...savedMessage.toObject(),
              unread_details: {
                user_id: receiverId,
                unread_count: unreadMessagesCount,
              },
            });
          }
        } else {
          // initial communication between 2 users
          const newChat = new ChatModel({
            chat_type: "private",
            participant_ids: [senderId, receiverId],
          });

          await newChat.save();

          newMessage.chat_id = newChat?._id;

          await newMessage.save();

          const unreadMessagesCount = await MessageModel.countDocuments({
            chat_id: newChat?._id,
            receiver_id: receiverId,
            is_read: false,
          });

          const senderDetails = onlineUsers.get(
            newMessage?.sender_id?.toString()
          );

          const receiverDetails = onlineUsers.get(
            newMessage?.receiver_id?.toString()
          );

          // Make the sender join the room
          io.sockets.sockets
            .get(senderDetails?.socket_id)
            ?.join(newChat._id.toString());

          // Make the receiver join the room
          io.sockets.sockets
            .get(receiverDetails?.socket_id)
            ?.join(newChat._id.toString());

          chatOpenStatuses.set(newMessage?.sender_id?.toString(), {
            chat_id: newChat?._id?.toString(),
            chat_open: true,
          });

          io.to(newChat._id.toString())
            // .to(receiverDetails?.socket_id)
            .emit("private_message", {
              ...newMessage.toObject(),
              is_new_chat: true, // informing sender and receiver NEW chat created to get that chat to display
              unread_details: {
                user_id: receiverId,
                unread_count: unreadMessagesCount,
              },
            });
        }
      } catch (err) {
        console.log(err, "- error on private_message");
        callback({ status: 400, message: err?.message || err });
        return;
      }
    });

    socket.on("chat_opened", async function (data, callback) {
      const { userId, chatId } = data;
      try {
        chatOpenStatuses.set(userId, {
          chat_id: chatId,
          chat_open: true,
        });
        const updatedMessageIds = await updateAndReturnIds(
          { chat_id: chatId, receiver_id: userId, is_read: false },
          { is_read: true },
          MessageModel
        );
        socket
          .to(chatId)
          .emit("chat_opened", { updated_message_ids: updatedMessageIds });
        callback({ ok: true, is_done: true });
      } catch (err) {
        console.log(err, "- error on chat_opened");
        callback({ ok: true });
      }
    });
  });
};

// to-do:
// 1. when user updates his credentials, should implement seperate logic to notify users who communicated each other
