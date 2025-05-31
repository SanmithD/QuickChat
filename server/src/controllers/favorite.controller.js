import { favoriteModel } from '../models/favorite.model.js';

export const toggleFavoriteUser = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    let favDoc = await favoriteModel.findOne({ userId: myId });

    if (!favDoc) {
      favDoc = await favoriteModel.create({ userId: myId, favorite: [userId] });
      return res.status(200).json({ message: "Added to favorites" });
    }

    const isFavorite = favDoc.favorite.includes(userId);

    if (isFavorite) {
      favDoc.favorite.pull(userId);
    } else {
      favDoc.favorite.push(userId);
    }

    await favDoc.save();

    res.status(200).json({
      success: true,
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getFavoriteUsers = async (req, res) => {
  try {
    const myId = req.user._id;

    const favDocs = await favoriteModel
      .find({ userId: myId })
      .populate("favorite", "-password");

    if (!favDocs || favDocs.length === 0) {
      return res.status(404).json({ message: "No favorites found" });
    }

    const allFavorites = favDocs.flatMap(doc => doc.favorite);

    res.status(200).json(allFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

