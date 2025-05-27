"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import io from "socket.io-client"
import { useTranslation } from "react-i18next"
import Header from "./Header"
import ChatInterface from "./ChatInterface"
import MessageInput from "./MessageInput"
import { getChatHistoryApi, getAllChats } from "../../api/messages.api"
import { formatDistanceToNow } from "date-fns"
import { X, Search, PlusCircle, Menu } from "lucide-react"
import LanguageSelector from "../../Components/LanguageSelector"

// Create socket instance
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080")

// Avatar component with profile picture and initials fallback
const Avatar = ({ user, size = "medium", className = "" }) => {
    const [imageError, setImageError] = useState(false)

    const sizeClasses = {
        small: "h-8 w-8 text-sm",
        medium: "h-12 w-12 text-lg",
        large: "h-16 w-16 text-xl",
    }

    const getInitials = (name) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleImageError = () => {
        setImageError(true)
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-600 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 ${className}`}
        >
            {user?.profilePicture && !imageError ? (
                <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
            ) : (
                <span className="font-bold text-white">{getInitials(user?.name)}</span>
            )}
        </div>
    )
}

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [contacts, setContacts] = useState([])
    const [selectedContact, setSelectedContact] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showNewMessageModal, setShowNewMessageModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const messagesEndRef = useRef(null)
    const location = useLocation()
    const { user } = useSelector((state) => state.user)
    const { t } = useTranslation()

    // Check if screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            // On desktop, sidebar should always be visible
            if (!mobile) {
                setShowSidebar(true)
            }
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    // Get recipient from location state or params
    const product = location.state?.product || {
        name: "Unknown Product",
        owner: { name: "Unknown Owner", _id: "" },
        images: [],
    }

    const owner = selectedContact || product.owner || { _id: "" }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (product.owner._id !== "") {
            startConversation({
                _id: product.owner._id,
                name: product.owner.name || product.owner._id,
                profilePicture: product.images[0],
            })
        }

        // Connect to socket and join room when component mounts
        socket.emit("joinRoom", { userId: user?._id })

        // Listen for connect/disconnect events
        socket.on("connect", () => {
            if (user?._id) {
                socket.emit("joinRoom", { userId: user._id })
            }
        })

        // Clean up socket connection on component unmount
        return () => {
            socket.off("connect")
            if (user?._id) {
                socket.emit("leaveRoom", { userId: user._id })
            }
        }
    }, [])

    const sendMessage = (content, attachment) => {
        const message = {
            from: user._id,
            to: owner._id,
            content: content,
            timestamp: new Date(),
        }

        if (attachment) {
            message.attachments = attachment
        }

        setMessages((prevMessages) => [...prevMessages, message])
        socket.emit("sendMessage", { userId: owner._id, message })

        // Add user to contacts if not already there
        const contactExists = contacts.some((contact) => contact.user._id === owner._id)
        if (!contactExists) {
            const newContact = {
                _id: Date.now().toString(),
                user: {
                    _id: owner._id,
                    name: owner.name,
                    profilePicture: owner.profilePicture,
                },
                latestMessage: {
                    content: content,
                    timestamp: new Date(),
                },
                unreadCount: 0,
            }
            setContacts((prevContacts) => [...prevContacts, newContact])
        }
    }

    // Search users for new conversation
    const handleSearch = async (query) => {
        if (query.trim().length < 2) {
            setSearchResults([])
            return
        }
        // Search implementation would go here
    }

    // Start a new conversation with a user
    const startConversation = (newContact) => {
        setSelectedContact({
            _id: newContact._id,
            name: newContact.name,
            profilePicture: newContact.profilePicture,
        })
        setShowNewMessageModal(false)
        // Only close sidebar on mobile when selecting a contact
        if (isMobile) {
            setShowSidebar(false)
        }
        setMessages([])
    }

    // Fetch all contacts (chats)
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true)
                const response = await getAllChats()
                const allContacts = response.data
                setContacts(allContacts)
            } catch (error) {
                console.error("Error fetching contacts:", error)
            } finally {
                setLoading(false)
            }
        }

        if (user?._id) {
            fetchContacts()
        }
    }, [user])

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedContact) {
                try {
                    const chatHistory = await getChatHistoryApi(selectedContact._id)
                    setMessages(chatHistory)
                } catch (error) {
                    console.error("Error fetching chat history:", error)
                }
            }
        }

        fetchChatHistory()
    }, [selectedContact])

    // Listen for incoming messages
    useEffect(() => {
        const handleIncomingMessage = (data) => {
            const processedData = {
                ...data,
                attachments: Array.isArray(data.attachments) ? data.attachments : [],
            }

            if (selectedContact && data.from === selectedContact._id) {
                setMessages((prevMessages) => [...prevMessages, processedData])
            }

            setContacts((prevContacts) => {
                return prevContacts.map((contact) => {
                    if (contact.user._id === data.from) {
                        return {
                            ...contact,
                            latestMessage: {
                                content: data.content,
                                timestamp: data.timestamp,
                                hasAttachments: data.attachments && data.attachments.length > 0,
                            },
                            unreadCount:
                                selectedContact && selectedContact._id === contact.user._id ? 0 : (contact.unreadCount || 0) + 1,
                        }
                    }
                    return contact
                })
            })
        }

        socket.on("receiveMessage", handleIncomingMessage)

        return () => {
            socket.off("receiveMessage", handleIncomingMessage)
        }
    }, [user, selectedContact])

    // Sidebar styles
    const getSidebarStyle = () => {
        if (!isMobile) {
            // Desktop: always visible
            return {
                width: "300px",
                position: "relative",
                transform: "translateX(0)",
                transition: "none",
            }
        } else {
            // Mobile: toggleable
            return {
                width: "100%",
                maxWidth: "320px",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s ease-in-out",
                zIndex: 50,
            }
        }
    }

    const getBackdropStyle = () => {
        return {
            display: isMobile && showSidebar ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
        }
    }

    const getMainContentStyle = () => {
        return {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            marginLeft: !isMobile ? 0 : 0, // No margin needed since sidebar is positioned
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#0E0F15" }}>
            {/* Mobile header - only show on mobile */}
            {isMobile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #2A2D3A",
                        padding: "12px 16px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => setShowSidebar(true)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                padding: "8px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#2A2D3A"
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent"
                            }}
                        >
                            <Menu size={24} />
                        </button>
                        <h1
                            style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "white",
                                margin: 0,
                            }}
                        >
                            {selectedContact ? selectedContact.name : t("chat.messages")}
                        </h1>
                    </div>
                    <LanguageSelector />
                </div>
            )}

            {/* Desktop header - only show on desktop */}
            {!isMobile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #2A2D3A",
                        padding: "12px 16px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "white",
                            margin: 0,
                        }}
                    >
                        {t("chat.messages")}
                    </h1>
                    <LanguageSelector />
                </div>
            )}

            <div style={{ flex: 1, overflow: "hidden", display: "flex", position: "relative" }}>
                {/* Mobile backdrop */}
                <div style={getBackdropStyle()} onClick={() => setShowSidebar(false)} />

                {/* Left sidebar - Contacts */}
                <div
                    style={{
                        ...getSidebarStyle(),
                        backgroundColor: "#0E0F15",
                        borderRight: "1px solid #2A2D3A",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Mobile close button */}
                    {isMobile && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 16px",
                                borderBottom: "1px solid #2A2D3A",
                            }}
                        >
                            <h2 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "600" }}>Contacts</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#9CA3AF",
                                    cursor: "pointer",
                                    padding: "4px",
                                    borderRadius: "4px",
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    <div
                        style={{
                            padding: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #2A2D3A",
                        }}
                    >
                        <input
                            type="text"
                            placeholder={t("chat.searchMessages")}
                            style={{
                                flex: 1,
                                backgroundColor: "#13141D",
                                border: "1px solid #2A2D3A",
                                borderRadius: "20px",
                                padding: "8px 16px",
                                color: "white",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {loading ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "128px",
                                    color: "white",
                                }}
                            >
                                {t("chat.loadingContacts")}
                            </div>
                        ) : contacts.length === 0 ? (
                            <div
                                style={{
                                    padding: "16px",
                                    textAlign: "center",
                                    color: "#9CA3AF",
                                }}
                            >
                                {t("chat.noConversations")}
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    onClick={() =>
                                        startConversation({
                                            _id: contact._id,
                                            name: contact.user.name,
                                            profilePicture: contact.user.profilePicture,
                                        })
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px",
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedContact && selectedContact._id === contact.user._id ? "#191B24" : "transparent",
                                        transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedContact?._id !== contact.user._id) {
                                            e.target.style.backgroundColor = "#191B24"
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedContact?._id !== contact.user._id) {
                                            e.target.style.backgroundColor = "transparent"
                                        }
                                    }}
                                >
                                    <Avatar user={contact.user} size="medium" />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontWeight: "500",
                                                    color: "white",
                                                    margin: 0,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {contact.user.name}
                                            </h3>
                                            {contact.latestMessage && contact.latestMessage.timestamp && (
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#9CA3AF",
                                                    }}
                                                >
                                                    {formatDistanceToNow(new Date(contact.latestMessage.timestamp), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: "#9CA3AF",
                                                margin: "4px 0 0 0",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {contact.latestMessage ? contact.latestMessage.content : ""}
                                        </p>
                                        {contact.unreadCount > 0 && (
                                            <div style={{ marginTop: "4px" }}>
                                                <span
                                                    style={{
                                                        backgroundColor: "#4D39EE",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        padding: "2px 6px",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    {contact.unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right side - Chat */}
                <div style={getMainContentStyle()}>
                    {selectedContact ? (
                        <>
                            <Header productName={selectedContact.name} ownerName={selectedContact.name} user={selectedContact} />
                            <ChatInterface
                                messages={messages}
                                messagesEndRef={messagesEndRef}
                                currentUserId={user?._id}
                                currentUser={user}
                                selectedContact={selectedContact}
                            />
                            <MessageInput onSendMessage={sendMessage} />
                        </>
                    ) : (
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "16px",
                            }}
                        >
                            <div
                                style={{
                                    padding: "24px",
                                    borderRadius: "50%",
                                    backgroundColor: "#191B24",
                                    marginBottom: "16px",
                                }}
                            >
                                <svg
                                    style={{ width: "48px", height: "48px", color: "#4D39EE" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h2
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "white",
                                    marginBottom: "8px",
                                }}
                            >
                                {t("chat.yourMessages")}
                            </h2>
                            <p
                                style={{
                                    color: "#9CA3AF",
                                    maxWidth: "400px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {t("chat.yourMessagesDesc")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 60,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        paddingTop: "80px",
                    }}
                >
                    <div
                        style={{
                            width: "400px",
                            maxWidth: "90vw",
                            backgroundColor: "#0E0F15",
                            borderRadius: "8px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "16px",
                                borderBottom: "1px solid #2A2D3A",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    color: "white",
                                    margin: 0,
                                }}
                            >
                                {t("chat.newMessage")}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowNewMessageModal(false)
                                    setSearchQuery("")
                                    setSearchResults([])
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#9CA3AF",
                                    cursor: "pointer",
                                    padding: "4px",
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: "16px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "16px",
                                }}
                            >
                                <Search size={18} style={{ color: "#9CA3AF" }} />
                                <input
                                    type="text"
                                    placeholder={t("chat.searchUsers")}
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#13141D",
                                        border: "1px solid #2A2D3A",
                                        borderRadius: "4px",
                                        padding: "8px 12px",
                                        color: "white",
                                        outline: "none",
                                    }}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        handleSearch(e.target.value)
                                    }}
                                />
                            </div>

                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {searchLoading ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "80px",
                                            color: "white",
                                        }}
                                    >
                                        {t("chat.searching")}
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <div
                                            key={user._id}
                                            onClick={() => startConversation(user)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "12px",
                                                cursor: "pointer",
                                                borderRadius: "6px",
                                                transition: "background-color 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#191B24"
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "transparent"
                                            }}
                                        >
                                            <Avatar user={user} size="small" />
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "white",
                                                    }}
                                                >
                                                    {user.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#9CA3AF",
                                                    }}
                                                >
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <div
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            color: "#9CA3AF",
                                        }}
                                    >
                                        {t("chat.noUsersFound")}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            color: "#9CA3AF",
                                        }}
                                    >
                                        {t("chat.typeToSearch")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat
