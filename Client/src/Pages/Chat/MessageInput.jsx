"use client"

import { useState, useRef } from "react"
import { Smile, Send, ImageIcon, X } from "lucide-react"

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [attachments, setAttachments] = useState([])
  const fileInputRef = useRef(null)

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (message.trim() || attachments.length > 0) {
      // Process any attachments to include base64 data
      const processedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          const base64Data = await fileToBase64(attachment.file)
          return base64Data
        }),
      )
      // Send message with processed attachments
      onSendMessage(message, processedAttachments)
      setMessage("")
      setAttachments([])
    }
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Convert files to attachments with preview URLs
      const newAttachments = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
      }))
      setAttachments([...attachments, ...newAttachments])
    }
  }

  // Remove an attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  // Basic emoji picker options
  const emojiOptions = ["😊", "👍", "❤️", "🙏", "😂", "🎉", "👋", "🤔", "👌", "🔥"]

  const containerStyle = {
    padding: window.innerWidth >= 768 ? "12px" : "8px",
    backgroundColor: "#191B24",
    borderTop: "1px solid rgba(77, 57, 238, 0.2)",
  }

  const attachmentsPreviewStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "8px",
    padding: "8px",
    backgroundColor: "#151823",
    borderRadius: "8px",
  }

  const attachmentItemStyle = {
    position: "relative",
    group: true,
  }

  const attachmentImageStyle = {
    width: window.innerWidth >= 768 ? "64px" : "48px",
    height: window.innerWidth >= 768 ? "64px" : "48px",
    borderRadius: "6px",
    overflow: "hidden",
  }

  const attachmentFileStyle = {
    width: window.innerWidth >= 768 ? "64px" : "48px",
    height: window.innerWidth >= 768 ? "64px" : "48px",
    borderRadius: "6px",
    backgroundColor: "#212330",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "4px",
    fontSize: "10px",
    color: "white",
  }

  const removeButtonStyle = {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    backgroundColor: "#EF4444",
    color: "white",
    borderRadius: "50%",
    padding: "2px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    fontSize: "12px",
  }

  const formStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const inputContainerStyle = {
    position: "relative",
    flex: 1,
  }

  const leftButtonsStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }

  const iconButtonStyle = {
    background: "none",
    border: "none",
    color: "#9CA3AF",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#13141D",
    border: "1px solid #2A2D3A",
    borderRadius: "24px",
    padding: window.innerWidth >= 768 ? "12px 60px 12px 60px" : "10px 50px 10px 50px",
    color: "white",
    outline: "none",
    fontSize: window.innerWidth >= 768 ? "16px" : "14px",
    minHeight: window.innerWidth >= 768 ? "48px" : "44px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  const rightButtonStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
  }

  const sendButtonStyle = {
    backgroundColor: "#4D39EE",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: window.innerWidth >= 768 ? "40px" : "36px",
    height: window.innerWidth >= 768 ? "40px" : "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(77, 57, 238, 0.3)",
    flexShrink: 0,
  }

  const emojiPickerStyle = {
    backgroundColor: "#212330",
    borderRadius: "8px",
    padding: "8px",
    marginTop: "8px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  }

  const emojiButtonStyle = {
    background: "none",
    border: "none",
    fontSize: window.innerWidth >= 768 ? "20px" : "18px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s",
    minWidth: window.innerWidth >= 768 ? "auto" : "44px",
    minHeight: window.innerWidth >= 768 ? "auto" : "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <div style={containerStyle}>
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div style={attachmentsPreviewStyle}>
          {attachments.map((attachment) => (
            <div key={attachment.id} style={attachmentItemStyle}>
              {attachment.type.startsWith("image/") ? (
                <div style={attachmentImageStyle}>
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div style={attachmentFileStyle}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{attachment.name}</span>
                </div>
              )}
              <button onClick={() => removeAttachment(attachment.id)} style={removeButtonStyle}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputContainerStyle}>
          <div style={leftButtonsStyle}>
            <button
              type="button"
              style={iconButtonStyle}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => (e.target.style.color = "#4D39EE")}
              onMouseLeave={(e) => (e.target.style.color = "#9CA3AF")}
            >
              <ImageIcon size={window.innerWidth >= 768 ? 18 : 16} />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
            multiple
            accept="image/*"
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#4D39EE"
              e.target.style.boxShadow = "0 0 0 2px rgba(77, 57, 238, 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#2A2D3A"
              e.target.style.boxShadow = "none"
            }}
          />

          <div style={rightButtonStyle}>
            <button
              type="button"
              style={{
                ...iconButtonStyle,
                color: showEmojiPicker ? "#4D39EE" : "#9CA3AF",
              }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              onMouseEnter={(e) => (e.target.style.color = "#4D39EE")}
              onMouseLeave={(e) => (e.target.style.color = showEmojiPicker ? "#4D39EE" : "#9CA3AF")}
            >
              <Smile size={window.innerWidth >= 768 ? 18 : 16} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() && attachments.length === 0}
          style={{
            ...sendButtonStyle,
            opacity: !message.trim() && attachments.length === 0 ? 0.5 : 1,
            cursor: !message.trim() && attachments.length === 0 ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (message.trim() || attachments.length > 0) {
              e.target.style.backgroundColor = "rgba(77, 57, 238, 0.9)"
              e.target.style.boxShadow = "0 4px 12px rgba(77, 57, 238, 0.4)"
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4D39EE"
            e.target.style.boxShadow = "0 2px 8px rgba(77, 57, 238, 0.3)"
          }}
        >
          <Send size={window.innerWidth >= 768 ? 18 : 16} />
        </button>
      </form>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div style={emojiPickerStyle}>
          {emojiOptions.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setMessage(message + emoji)
                setShowEmojiPicker(false)
              }}
              style={emojiButtonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2A2D3A")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
