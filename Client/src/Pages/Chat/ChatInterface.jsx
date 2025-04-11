import { formatDistanceToNow } from "date-fns"

export default function ChatInterface({ messages, messagesEndRef }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4">
            {messages?.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] rounded-2xl p-3 md:p-4 ${message.isOwn
                            ? "bg-gradient-to-r from-[#4D39EE] to-[#4D39EE]/80 text-white"
                            : "bg-[#2A2D3A] text-white"
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-base md:text-lg">{message.sender}</span>
                            <span className="text-xs md:text-sm opacity-70">
                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-base md:text-lg">{message.content}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}
