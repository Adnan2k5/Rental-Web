import { useState } from "react";
import { format } from "date-fns";

// Avatar component with profile picture and initials fallback
const Avatar = ({ user, size = "medium", className = "" }) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    small: { width: '24px', height: '24px', fontSize: '12px' },
    medium: { width: '32px', height: '32px', fontSize: '14px' },
    large: { width: '48px', height: '48px', fontSize: '18px' }
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const style = {
    ...sizeClasses[size],
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #4D39EE, #4FC3F7)',
    flexShrink: 0
  }

  return (
    <div style={style} className={className}>
      {user?.profilePicture && !imageError ? (
        <img
          src={user.profilePicture || "/placeholder.svg"}
          alt={user.name || "User"}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={handleImageError}
        />
      ) : (
        <span style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: sizeClasses[size].fontSize
        }}>
          {getInitials(user?.name)}
        </span>
      )}
    </div>
  )
}

export default function ChatInterface({ messages, messagesEndRef, currentUserId, currentUser, selectedContact }) {
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

  const containerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: window.innerWidth >= 768 ? '16px' : '12px',
    background: 'linear-gradient(to bottom, #0E0F15, #13141D)'
  };

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '24px'
  };

  const emptyIconStyle = {
    backgroundColor: '#191B24',
    padding: window.innerWidth >= 768 ? '20px' : '16px',
    borderRadius: '50%',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  };

  const dateHeaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  };

  const dateChipStyle = {
    backgroundColor: '#191B24',
    padding: '4px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#9CA3AF',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  // If there are no messages, show an empty state
  if (messages.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>
            <svg style={{ width: window.innerWidth >= 768 ? '48px' : '32px', height: window.innerWidth >= 768 ? '48px' : '32px', color: '#4D39EE' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 style={{
            fontSize: window.innerWidth >= 768 ? '18px' : '16px',
            fontWeight: '500',
            color: 'white',
            marginBottom: '8px'
          }}>
            No messages yet
          </h3>
          <p style={{
            color: '#9CA3AF',
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: '1.5',
            fontSize: window.innerWidth >= 768 ? '16px' : '14px'
          }}>
            Start a conversation by sending a message below. Be polite and clear about your rental inquiries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} id="chat-messages">
      {Object.keys(groupedMessages).map(dateKey => (
        <div key={dateKey} style={{ marginBottom: '16px' }}>
          <div style={dateHeaderStyle}>
            <div style={dateChipStyle}>
              {formatDateHeader(dateKey)}
            </div>
          </div>

          {groupedMessages[dateKey].map((message, index) => {
            const isSender = isCurrentUser(message.from);
            const messageUser = isSender ? currentUser : selectedContact;

            const messageContainerStyle = {
              display: 'flex',
              justifyContent: isSender ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
              animation: 'fadeIn 0.3s ease-out'
            };

            const messageContentStyle = {
              maxWidth: window.innerWidth >= 768 ? '75%' : '85%',
              display: 'flex',
              flexDirection: 'column'
            };

            const messageBubbleStyle = {
              padding: window.innerWidth >= 768 ? '12px 16px' : '10px 12px',
              borderRadius: '18px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              fontSize: window.innerWidth >= 768 ? '16px' : '14px',
              lineHeight: '1.4',
              wordWrap: 'break-word',
              ...(isSender ? {
                background: 'linear-gradient(135deg, #4D39EE, rgba(77, 57, 238, 0.9))',
                color: 'white',
                borderTopRightRadius: '4px'
              } : {
                backgroundColor: '#212330',
                color: 'white',
                borderTopLeftRadius: '4px'
              })
            };

            const timestampStyle = {
              fontSize: '12px',
              color: '#9CA3AF',
              marginTop: '4px',
              textAlign: isSender ? 'right' : 'left',
              paddingLeft: isSender ? 0 : '4px',
              paddingRight: isSender ? '4px' : 0
            };

            const avatarContainerStyle = {
              display: 'flex',
              alignItems: 'flex-end',
              margin: isSender ? '0 0 0 8px' : '0 8px 0 0'
            };

            return (
              <div key={index} style={messageContainerStyle}>
                {!isSender && (
                  <div style={avatarContainerStyle}>
                    <Avatar user={messageUser} size="medium" />
                  </div>
                )}

                <div style={messageContentStyle}>
                  <div style={messageBubbleStyle}>
                    {/* Message text content */}
                    {message.content && (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                    )}

                    {/* Message attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div style={{
                        marginTop: message.content ? '8px' : '0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {message.attachments.map((base64Image, index) => (
                          <div key={index} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                            <a
                              href={base64Image}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'block' }}
                            >
                              <img
                                src={base64Image || "/placeholder.svg"}
                                alt={`Image ${index + 1}`}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: window.innerWidth >= 768 ? '200px' : '150px',
                                  objectFit: 'contain',
                                  borderRadius: '8px',
                                  cursor: 'pointer'
                                }}
                                loading="lazy"
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={timestampStyle}>
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </div>
                </div>

                {isSender && (
                  <div style={avatarContainerStyle}>
                    <Avatar user={messageUser} size="medium" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
