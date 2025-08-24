const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");
const ChatMemberModel = require("../models/chatMemberModel");
const MessageModel = require("../models/messageModel");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("../config/sessionStore");
const sessionStore = new InMemorySessionStore();
const onlineUsers = new Map();
const chatOpenStatuses = new Map();

async function privateChat(data, callback) {
  const { senderId, receiverId, content, contentType, replyToMessageId } = data;
  if (
    senderId?.trim() === "" ||
    !senderId ||
    receiverId?.trim() === "" ||
    !receiverId
  ) {
    // return callback({ error: "Sender or receiver identifiers required !" });
    console.log("Sender or receiver identifiers required !");
  }

  // Trim message content to avoid sending empty messages
  if (content?.trim() === "") {
    // return callback({ error: "Content required!" });
    console.log("Content required!");
  }
  try {
    // const { user } = socket.handshake.session;
    const chat = await ChatModel.findOne(
      {
        chat_type: 1,
        participant_ids: { $all: [senderId, receiverId] },
      },
      { _id: 1 }
    );

    const newMessage = new MessageModel({
      chat_id: chat?._id,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      content_type: contentType || 1,
      replied_to: replyToMessageId && replyToMessageId,
      is_edited: false,
      is_read: false,
    });

    if (chat) {
      console.log("chat");
      const receiverOnChat = chatOpenStatuses.get(
        newMessage?.receiver_id?.toString()
      );

      console.log(receiverOnChat, "- receiverOnChat");

      const unreadMessagesCount = await MessageModel.countDocuments({
        chat_id: chat?._id,
        receiver_id: receiverId,
        is_read: false,
      });

      if (receiverOnChat?.chat_id == chat?._id?.toString()) {
        // if chat's open on receiver
        newMessage.is_read = true; // marking message as read
        const savedMessage = await newMessage.save();

        await savedMessage.populate([
          // { path: "sender_id", select: "accent_color" },
          // { path: "receiver_id", select: "accent_color" },
          { path: "replied_to", select: "content" },
        ]);

        io.to(chat._id.toString()).emit("private_message", {
          ...savedMessage.toObject(),
          unreadDetails: {
            user_id: receiverId,
            unread_count: unreadMessagesCount,
          },
        });
      } else {
        console.log("chat else");
        // if chat's NOT open on receiver, remaining message as unread
        const savedMessage = await newMessage.save();

        await savedMessage.populate([
          // { path: "sender_id", select: "accent_color" },
          // { path: "receiver_id", select: "accent_color" },
          { path: "replied_to", select: "content" },
        ]);

        io.to(chat._id.toString()).emit("private_message", {
          ...savedMessage.toObject(),
          unreadDetails: {
            user_id: receiverId,
            unread_count: unreadMessagesCount,
          },
        });
      }
    } else {
      // initial communication between 2 users
      const newChat = new ChatModel({
        chat_type: 1,
        participant_ids: [senderId, receiverId],
      });

      await newChat.save();

      newMessage.chat_id = newChat?._id;

      await newMessage.save();

      const unreadMessagesCount = await MessageModel.countDocuments({
        chat_id: chat?._id,
        receiver_id: receiverId,
        is_read: false,
      });

      const receiverDetails = onlineUsers.get(
        newMessage?.receiver_id?.toString()
      );

      io.to(newChat._id.toString())
        .to(receiverDetails?.socket_id)
        .emit("private_message", {
          ...newMessage.toObject(),
          is_new_chat: true, // informing sender and receiver NEW chat created to get that chat to display
          unreadDetails: {
            user_id: receiverId,
            unread_count: unreadMessagesCount,
          },
        });
    }
  } catch (err) {
    console.log(err, "- error on private_message");
  }
}

module.exports = privateChat;
