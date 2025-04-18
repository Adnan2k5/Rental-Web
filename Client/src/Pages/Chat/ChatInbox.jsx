import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { getAllChats } from "../../api/messages.api.js";

export default function ChatInbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await getAllChats();
        if (response.success) {
          setChats(response.data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user]);

  const navigateToChat = (chat) => {
    navigate(`/chat`, {
      state: {
        owner: {
          _id: chat._id,
          name: chat.user.name,
          avatar: chat.user.avatar
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Your Conversations</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="text-white">Loading conversations...</div>
        </div>
      ) : chats.length === 0 ? (
        <div className="bg-[#2A2D3A] rounded-lg p-6 text-center">
          <p className="text-white text-lg">You have no conversations yet.</p>
          <p className="text-gray-400 mt-2">
            Start browsing items to chat with owners!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => navigateToChat(chat)}
              className="bg-[#2A2D3A] rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-[#2A2D3A]/80 transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src={chat.user.avatar || "https://via.placeholder.com/50"}
                  alt={chat.user.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {chat.user.name}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(chat.latestMessage.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-300 truncate mt-1">
                  {chat.latestMessage.content}
                </p>
                {chat.unreadCount > 0 && (
                  <div className="mt-2 flex items-center">
                    <span className="bg-[#4D39EE] text-white text-xs font-bold px-2 py-1 rounded-full">
                      {chat.unreadCount} new
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}