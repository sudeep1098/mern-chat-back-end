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

//get all messages
export const getMessages = async (req, res) => {
  try {
    const sender = req.user;
    const { receiverId } = req.body;
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: sender._id, receiver: receiver._id },
        { sender: receiver._id, receiver: sender._id },
      ],
    }).sort({ updatedAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Message.findByIdAndUpdate(messageId, { read: true });
    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
