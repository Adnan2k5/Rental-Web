import { useState } from "react";
import { format } from "date-fns";
import { Avatar } from "../../components/ui/avatar";

export default function ChatInterface({ messages, messagesEndRef, currentUserId }) {
  // Sample avatar for demo (replace with actual user image)
  const [userAvatar, setUserAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=user");
  const [otherAvatar, setOtherAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=other");

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);
  
  // Check if a message is from the current user
  const isCurrentUser = (from) => from === currentUserId;

  // Format date header
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  // If there are no messages, show an empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6 flex flex-col items-center justify-center">
        <div className="bg-[#191B24] p-5 rounded-full mb-4 shadow-lg">
          <svg className="w-12 h-12 text-[#4D39EE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
        <p className="text-gray-400 text-center max-w-md">
          Start a conversation by sending a message below. Be polite and clear about your rental inquiries.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 bg-gradient-to-b from-[#0E0F15] to-[#13141D]" id="chat-messages">
      {Object.keys(groupedMessages).map(dateKey => (
        <div key={dateKey} className="mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[#191B24] px-4 py-1 rounded-full text-xs text-gray-400 font-medium shadow-md">
              {formatDateHeader(dateKey)}
            </div>
          </div>
          
          {groupedMessages[dateKey].map((message, index) => {
            const isSender = isCurrentUser(message.from);
            return (
              <div 
                key={index} 
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}
              >
                {!isSender && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <img src={otherAvatar} alt="User avatar" />
                    </Avatar>
                  </div>
                )}
                
                <div className={`max-w-[75%] group`}>
                  <div 
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      isSender 
                        ? 'bg-gradient-to-r from-[#4D39EE] to-[#4D39EE]/90 text-white rounded-tr-none' 
                        : 'bg-[#212330] text-white rounded-tl-none'
                    }`}
                  >
                    {/* Message text content */}
                    {message.content && (
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                    
                    {/* Message attachments - simplified handling for array of base64 images */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className={`${message.content ? 'mt-2' : ''} flex flex-wrap gap-2`}>
                        {message.attachments.map((base64Image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <a 
                              href={base64Image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img 
                                src={base64Image} 
                                alt={`Image ${index + 1}`}
                                className="max-w-full max-h-[200px] object-contain rounded-lg cursor-pointer"
                                loading="lazy"
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs mt-1 text-gray-400 ${isSender ? 'text-right mr-1' : 'ml-1'}`}>
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </div>
                </div>
                
                {isSender && (
                  <div className="flex-shrink-0 ml-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <img src={userAvatar} alt="User avatar" />
                    </Avatar>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
      
      {/* Add the date-fns import to package.json if needed */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
