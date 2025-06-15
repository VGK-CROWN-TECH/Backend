const { isEmpty } = require("../public/validation");
const { success, error, missingParam, created } = require("../public/response");
const Chat = require("../model/chat");

let chat = {
  message: async (payload) => {
    let reqFields = isEmpty(payload, ["senderId", "receiverId", "message"]);
    if (reqFields.length > 0) {
      return missingParam(reqFields);
    }
    try {
      const { senderId, receiverId, message, fileUrls } = payload;

      const newMessage = new Chat({
        senderId,
        receiverId,
        message,
        fileUrls: fileUrls || [],
      });

      const savedMessage = await newMessage.save();
      return created("Message stored succesfully", savedMessage);
    } catch (error) {
      return error(500, "Internal server error");
    }
  },

  getMessage: async (payload) => {
    let reqFields = isEmpty(payload, ["senderId", "receiverId"]);
    if (reqFields.length > 0) {
      return missingParam(reqFields);
    }

    try {
      const { senderId, receiverId, page = 1, limit = 30 } = payload;
      const skip = (page - 1) * limit;

      const messages = await Chat.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(limit);

      return success("Message fetched successfully", messages);
    } catch (error) {
      return error(500, "Internal server error");
    }
  },

  usersList: async (payload) => {
    let reqFields = isEmpty(payload, ["userId"]);
    if (reqFields.length > 0) {
      return missingParam(reqFields);
    }

    const userId = payload.userId;
    try {
      const chats = await Chat.aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $addFields: {
            otherUser: {
              $cond: [
                { $eq: ["$senderId", userId] },
                "$receiverId",
                "$senderId",
              ],
            },
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: "$otherUser",
            lastMessage: { $first: "$message" },
            lastTimestamp: { $first: "$timestamp" },
            lastChat: { $first: "$$ROOT" },
          },
        },
        {
          $sort: { lastTimestamp: -1 },
        },
      ]);

      return success("user list fetched successfully", chats);
    } catch (err) {
      return error(500, "Internal server error");
    }
  },
};

module.exports = chat;
