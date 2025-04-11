"use client"

import { useState, useEffect, useRef } from "react"
import Header from "./Header"
import ChatInterface from "./ChatInterface"
import MessageInput from "./MessageInput"

export default function Chat() {
    const messages = []
    const item = []
    const messagesEndRef = useRef(null)

    const sendMessage = (content) => {
        if (!content.trim()) return

        const newMessage = {
            id: messages.length + 1,
            sender: "You",
            content,
            timestamp: new Date().toISOString(),
            isOwn: true,
        }

        setMessages([...messages, newMessage])
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <div className="flex flex-col h-[100dvh] bg-white">
            <Header item={item} />
            <div className="flex-1 overflow-hidden flex flex-col">
                <ChatInterface messages={messages} messagesEndRef={messagesEndRef} />
                <MessageInput onSendMessage={sendMessage} />
            </div>
        </div>
    )
}
