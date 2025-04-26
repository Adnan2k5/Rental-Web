import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import io from "socket.io-client"
import Header from "./Header"
import ChatInterface from "./ChatInterface"
import MessageInput from "./MessageInput"
import { getChatHistoryApi, getAllChats } from "../../api/messages.api"
import { formatDistanceToNow } from "date-fns"
import { Avatar } from "../../Components/ui/avatar"
import { X, Search, PlusCircle } from "lucide-react"

// Create socket instance
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080")

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const { user } = useSelector((state) => state.user);

    // Get recipient from location state or params
    const product = location.state?.product || {
        name: "Unknown Product",
        owner: { name: "Unknown Owner", _id: "" },
        images: []
    };

    const owner = selectedContact || product.owner || { _id: "" };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (product.owner._id !== "") {
            startConversation({ _id: product.owner._id, name: product.owner.name || product.owner._id, avatar: product.images[0] });
        }

        // Connect to socket and join room when Components mounts
        socket.emit("joinRoom", { userId: user._id });

        // Listen for connect/disconnect events
        socket.on("connect", () => {
            console.log("Connected to socket server");
            // Re-join room if socket reconnects
            if (user?._id) {
                socket.emit("joinRoom", { userId: user._id });
            }
        });

        // Clean up socket connection on Components unmount
        return () => {
            socket.off("connect");
            if (user?._id) {
                socket.emit("leaveRoom", { userId: user._id });
            }
        };
    }, []);

    const sendMessage = (content, attachment) => {
        const message = {
            from: user._id,
            to: owner._id,
            content: content,
            timestamp: new Date(),
        }

        if (attachment) {
            message.attachments = attachment;
        }

        setMessages((prevMessages) => [...prevMessages, message])
        socket.emit("sendMessage", { userId: owner._id, message })

        // Add user to contacts if not already there
        const contactExists = contacts.some(contact => contact._id === owner._id);
        if (!contactExists) {
            const newContact = {
                _id: Date.now().toString(), // Temporary ID until refreshed
                user: {
                    _id: owner._id,
                    name: owner.name,
                    avatar: owner.avatar
                },
                latestMessage: {
                    content: content,
                    timestamp: new Date()
                },
                unreadCount: 0
            };
            setContacts(prevContacts => [...prevContacts, newContact]);
        }
    }

    // Search users for new conversation
    const handleSearch = async (query) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        // setSearchLoading(true);
        // try {
        //     const response = await searchUsers(query);
        //     if (response.success) {
        //         // Filter out the current user and existing contacts
        //         const filteredResults = response.data.filter(result => 
        //             result._id !== user._id && 
        //             !contacts.some(contact => contact.user._id === result._id)
        //         );
        //         setSearchResults(filteredResults);
        //     }
        // } catch (error) {
        //     console.error("Error searching users:", error);
        // } finally {
        //     setSearchLoading(false);
        // }
    };

    // Start a new conversation with a user
    const startConversation = (newContact) => {
        setSelectedContact({
            _id: newContact._id,
            name: newContact.name,
            avatar: newContact.avatar
        });
        setShowNewMessageModal(false);
        setMessages([]);
    };

    // Fetch all contacts (chats)
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const response = await getAllChats();
                let allContacts = response.data;
                setContacts(allContacts);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchContacts();
        }
    }, [user]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedContact) {
                try {
                    const chatHistory = await getChatHistoryApi(selectedContact._id);
                    setMessages(chatHistory);
                } catch (error) {
                    console.error("Error fetching chat history:", error);
                }
            }
        };

        fetchChatHistory();
    }, [selectedContact]);

    // Listen for incoming messages
    useEffect(() => {
        // Handle incoming messages
        const handleIncomingMessage = (data) => {
            // Process attachments if they exist - attachments are simply an array of base64 strings
            const processedData = {
                ...data,
                // Ensure attachments is always an array
                attachments: Array.isArray(data.attachments) ? data.attachments : []
            };

            // Add message to state if it's from the currently selected contact
            if (selectedContact && data.from === selectedContact._id) {
                setMessages(prevMessages => [...prevMessages, processedData]);
            }

            // Update the contacts list to show latest message
            setContacts(prevContacts => {
                return prevContacts.map(contact => {
                    if (contact.user._id === data.from) {
                        return {
                            ...contact,
                            latestMessage: {
                                content: data.content,
                                timestamp: data.timestamp,
                                // Include attachment info in latest message if present
                                hasAttachments: data.attachments && data.attachments.length > 0
                            },
                            unreadCount: selectedContact && selectedContact._id === contact.user._id
                                ? 0 : (contact.unreadCount || 0) + 1
                        };
                    }
                    return contact;
                });
            });
        };
        // Register event listener
        socket.on("receiveMessage", handleIncomingMessage);

        // Clean up event listener when Components unmounts
        return () => {
            socket.off("receiveMessage", handleIncomingMessage);
        };
    }, [user, selectedContact]);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#0E0F15]">
            <div className="border-b border-[#2A2D3A] py-3 px-4">
                <h1 className="text-2xl font-bold text-white">Messages</h1>
            </div>
            <div className="flex-1 overflow-hidden flex">
                {/* Left sidebar - Contacts */}
                <div className="w-[300px] border-r border-[#2A2D3A] flex flex-col">
                    <div className="p-3 flex items-center justify-between border-b border-[#2A2D3A]">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="flex-1 bg-[#13141D] border border-[#2A2D3A] rounded-full py-2 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4D39EE]"
                        />
                        <button
                            onClick={() => setShowNewMessageModal(true)}
                            className="ml-2 text-[#4D39EE] hover:text-[#6A58FF]"
                            title="New Message"
                        >
                            <PlusCircle size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="text-white">Loading contacts...</div>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                                No conversations yet
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    onClick={() => setSelectedContact({
                                        _id: contact._id,
                                        name: contact.user.name,
                                        avatar: contact.user.avatar
                                    })}
                                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#191B24] transition-colors ${selectedContact && selectedContact._id === contact.user._id
                                        ? 'bg-[#191B24]'
                                        : ''
                                        }`}
                                >
                                    <Avatar className="h-12 w-12 border-2 border-[#2A2D3A]">
                                        <img
                                            src={contact.user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                            alt={contact.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-white truncate">
                                                {contact.user.name}
                                            </h3>
                                            {contact.latestMessage && contact.latestMessage.timestamp && (
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(new Date(contact.latestMessage.timestamp), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate">
                                            {contact.latestMessage ? contact.latestMessage.content : ''}
                                        </p>
                                        {contact.unreadCount > 0 && (
                                            <div className="mt-1">
                                                <span className="bg-[#4D39EE] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
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
                <div className="flex-1 flex flex-col">
                    {selectedContact ? (
                        <>
                            <Header
                                productName={selectedContact.name}
                                ownerName={selectedContact.name}
                                productUrl={selectedContact.avatar || product.images[0]}
                            />
                            <ChatInterface
                                messages={messages}
                                messagesEndRef={messagesEndRef}
                                currentUserId={user?._id}
                            />
                            <MessageInput onSendMessage={sendMessage} />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <div className="p-6 rounded-full bg-[#191B24] mb-4">
                                <svg className="w-12 h-12 text-[#4D39EE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
                            <p className="text-gray-400 max-w-sm">
                                Send private messages to other users about rentals or items you're interested in.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
                    <div className="w-[400px] bg-[#0E0F15] rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4 border-b border-[#2A2D3A] flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">New Message</h3>
                            <button
                                onClick={() => {
                                    setShowNewMessageModal(false);
                                    setSearchQuery("");
                                    setSearchResults([]);
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for users..."
                                    className="flex-1 bg-[#13141D] border border-[#2A2D3A] rounded py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4D39EE]"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {searchLoading ? (
                                    <div className="flex justify-center items-center h-20">
                                        <div className="text-white">Searching...</div>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(user => (
                                        <div
                                            key={user._id}
                                            onClick={() => startConversation(user)}
                                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#191B24] rounded-md transition-colors"
                                        >
                                            <Avatar className="h-10 w-10 border border-[#2A2D3A]">
                                                <img
                                                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <div className="p-4 text-center text-gray-400">
                                        No users found
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-400">
                                        Type at least 2 characters to search
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}