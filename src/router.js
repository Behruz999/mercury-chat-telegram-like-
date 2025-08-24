const router = require("express").Router();
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const reactionStatusRouter = require("./routers/reactionStatusRouter");
const readStatusRouter = require("./routers/readStatusRouter");
const messageRouter = require("./routers/messageRouter");
const groupRouter = require("./routers/groupRouter");
const entityImageRouter = require("./routers/entityImageRouter");
const contactRouter = require("./routers/contactRouter");
const chatMemberRouter = require("./routers/chatMemberRouter");
const chatRouter = require("./routers/chatRouter");
const channelRouter = require("./routers/channelRouter");

router.use("/auth", authRouter);

router.use("/users", userRouter);

router.use("/reaction-statuses", reactionStatusRouter);

router.use("/read-statuses", readStatusRouter);

router.use("/messages", messageRouter);

router.use("/groups", groupRouter);

router.use("/entity-images", entityImageRouter);

router.use("/contacts", contactRouter);

router.use("/chat-members", chatMemberRouter);

router.use("/chats", chatRouter);

router.use("/channels", channelRouter);

module.exports = router;
