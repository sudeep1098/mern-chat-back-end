import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const sender = req.user;
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    const newMessage = new Message({
      sender: sender._id,
      receiver: receiverId,
      message,
    });
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get messages sent by the current user
export const getSentMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;
    // console.log(senderId, receiverId);

    const messages = await Message.find({
      sender: senderId,
      receiver: receiverId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching sent messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages received by the current user
export const getReceivedMessages = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { senderId } = req.params;
    console.log(receiverId, senderId);

    const messages = await Message.find({
      sender: senderId,
      receiver: receiverId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching received messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find the message by its ID and mark it as read
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.read = true;
    await message.save();

    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
