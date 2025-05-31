import { Bookmark, BookmarkMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/UseChatStore";

function AddToFavorite({ userId }) {
  const { favorites, toggleFavorite } = useChatStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const found = favorites.some(fav => fav._id === userId);
    setIsFavorite(found);
  }, [favorites, userId]);

  const toggleFavoriteBtn = () => {
    toggleFavorite(userId);
  };

  return (
    <button onClick={toggleFavoriteBtn} className="p-2 cursor-pointer">
      {isFavorite ? (
        <Bookmark className="text-yellow-500" />
      ) : (
        <BookmarkMinus className="text-gray-400" />
      )}
    </button>
  );
}

export default AddToFavorite;
