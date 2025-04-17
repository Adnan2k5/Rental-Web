import { useState, useEffect, useRef } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import io from "socket.io-client"
import Header from "./Header"
import ChatInterface from "./ChatInterface"
import MessageInput from "./MessageInput"

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

    const sendMessage = (message) => {
        const newMessage = {
            sender: user._id,
            recipient: owner._id,
            text: message,
            timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, newMessage])
        socket.emit("sendMessage", newMessage)
    }

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
