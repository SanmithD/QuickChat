import cloudinary from "../lib/cloudinary.js";
import { authModel } from "../models/auth.model.js";
import { messageModel } from "../models/message.model.js";

export const getUserSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id;
    const filteredUsers = await authModel
      .find({ _id: { $ne: loggedUser } })
      .select("-password");
    res.status(200).json({
      success: true,
      message: "Users",
      filteredUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error);
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  try {
    const myId = req.user._id;

    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "All messages",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error.message);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }

    const newMessage = new messageModel({
      myId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //todo : real time
    res.status(200).json({
      success: true,
      message: "message sent",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error);
  }
};
