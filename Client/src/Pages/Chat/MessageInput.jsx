import { useState, useRef } from "react";
import { Smile, Paperclip, Send, Image, X, Mic } from "lucide-react";
import { Button } from "../../Components/ui/button";

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      // Process any attachments to include base64 data
      const processedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          const base64Data = await fileToBase64(attachment.file);
          return base64Data;
        }));
      // Send message with processed attachments
      onSendMessage(message, processedAttachments);
      setMessage("");
      setAttachments([]);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Convert files to attachments with preview URLs
      const newAttachments = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  // Remove an attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  // Basic emoji picker options
  const emojiOptions = ["😊", "👍", "❤️", "🙏", "😂", "🎉", "👋", "🤔", "👌", "🔥"];

  return (
    <div className="p-3 bg-[#191B24] border-t border-[#4D39EE]/20">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#151823] rounded-lg">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              {attachment.type.startsWith("image/") ? (
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md bg-[#212330] flex items-center justify-center text-center p-1 text-xs text-white">
                  {attachment.name}
                </div>
              )}
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-[#4D39EE] rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={18} />
            </Button>

          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-[#13141D] border border-[#2A2D3A] rounded-full py-3 px-[4.5rem] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D39EE]/50 focus:border-[#4D39EE]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${showEmojiPicker ? 'text-[#4D39EE]' : 'text-gray-400 hover:text-[#4D39EE]'} rounded-full`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={18} />
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() && attachments.length === 0}
          className="bg-[#4D39EE] hover:bg-[#4D39EE]/90 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg shadow-[#4D39EE]/20"
        >
          <Send size={18} />
        </Button>
      </form>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="bg-[#212330] rounded-lg p-2 mt-2 flex flex-wrap gap-2 animate-fadeIn shadow-lg">
          {emojiOptions.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setMessage(message + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-xl hover:bg-[#2A2D3A] p-1 rounded-md transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
