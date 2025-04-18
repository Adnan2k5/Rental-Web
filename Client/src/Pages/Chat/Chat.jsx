import { useState, useEffect, useRef } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import io from "socket.io-client"
import Header from "./Header"
import ChatInterface from "./ChatInterface"
import MessageInput from "./MessageInput"
import { getChatHistoryApi } from "../../api/messages.api"

// Create socket instance
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8080")

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    
    // Get recipient from location state or params
    const product = location.state?.product || { 
        name: "Unknown Product",
        owner: { name: "Unknown Owner", _id: "" },
        images: []
    };
    
    const owner = product.owner || { _id: "" };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = (content) => {
        const message = {
            from: user._id,
            to: owner._id,
            content: content,
            timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, message])
        socket.emit("sendMessage", { userId: owner._id, message })
    }

    useEffect(() => {
        const getChatHistory = async () => {
            const history = await getChatHistoryApi(owner._id);
            console.log(history);
            setMessages(history);
        }

        getChatHistory();
    }, []);

    useEffect(() => {
        // Listen for incoming messages
        socket.on("receiveMessage", (message) => {
            // Only add the message if it's from the current chat partner
            if ((message.from === owner._id && message.to === user._id) || 
                (message.from === user._id && message.to === owner._id)) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        });
    
        // Connect/register the user with the socket
        if (user?._id) {
            socket.emit("setup", user._id);
        }
    
        // Cleanup on unmount
        return () => {
            socket.off("receiveMessage");
        };
    }, [user._id, owner._id]);


    return (
        <div className="flex flex-col h-[100dvh] bg-[#0E0F15]">
            <Header 
                productName={product.name} 
                ownerName={product.owner.name} 
                productUrl={product.images[0]}
            />
            <div className="flex-1 overflow-hidden flex flex-col">
                <ChatInterface 
                    messages={messages} 
                    messagesEndRef={messagesEndRef}
                    currentUserId={user?._id} 
                />
                <MessageInput onSendMessage={sendMessage} />
            </div>
        </div>
    )
}
