// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { X, Send, ImageIcon, Smile, Paperclip } from 'lucide-react'
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Avatar } from "../components/ui/avatar"
// // import { useSocket } from "../hooks/use-socket"

// export default function ChatModal({ isOpen = true, onClose }) {
//     const [messages, setMessages] = useState([])
//     const [newMessage, setNewMessage] = useState("")
//     const messagesEndRef = useRef(null)
//     // const { socket, connected } = useSocket(item.id)

//     // useEffect(() => {
//     //     if (socket) {
//     //         // Listen for incoming messages
//     //         socket.on("message", (message) => {
//     //             setMessages((prev) => [...prev, message])
//     //         })

//     //         // Join the room for this specific item
//     //         socket.emit("joinRoom", { itemId: item.id })

//     //         // Add welcome message
//     //         setMessages([
//     //             {
//     //                 id: "0",
//     //                 text: `Hi there! I'm interested in your "${item.title}". Is it still available?`,
//     //                 sender: "user",
//     //                 timestamp: new Date(),
//     //             },
//     //             {
//     //                 id: "1",
//     //                 text: `Yes, it's still available! Feel free to ask any questions.`,
//     //                 sender: "seller",
//     //                 timestamp: new Date(Date.now() + 1000),
//     //             },
//     //         ])

//     //         return () => {
//     //             socket.off("message")
//     //             socket.emit("leaveRoom", { itemId: item.id })
//     //         }
//     //     }
//     // }, [socket, item.id, item.title])

//     const item = {
//         id: "1",
//         title: "Sample Item",
//         seller: "John Doe",
//         image: "/placeholder.svg",
//     }

//     useEffect(() => {
//         // Scroll to bottom when messages change
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, [messages])

//     const handleSendMessage = () => {
//         if (newMessage.trim() === "") return

//         const message = {
//             id: Date.now().toString(),
//             text: newMessage,
//             sender: "user",
//             timestamp: new Date(),
//         }

//         setMessages((prev) => [...prev, message])
//         setNewMessage("")

//         // Send message to server
//         if (socket && connected) {
//             socket.emit("sendMessage", {
//                 itemId: item.id,
//                 message: message,
//             })

//             // Simulate seller response after a short delay
//             setTimeout(
//                 () => {
//                     const response = {
//                         id: (Date.now() + 1).toString(),
//                         text: getRandomResponse(),
//                         sender: "seller",
//                         timestamp: new Date(),
//                     }
//                     setMessages((prev) => [...prev, response])
//                 },
//                 1000 + Math.random() * 2000,
//             )
//         }
//     }

//     const getRandomResponse = () => {
//         const responses = [
//             "Yes, that sounds good!",
//             "I can deliver it tomorrow if that works for you.",
//             "Would you like to see more photos?",
//             "It's in excellent condition, barely used.",
//             "I'm flexible on the price if you're interested.",
//             "Let me know if you have any other questions!",
//         ]
//         return responses[Math.floor(Math.random() * responses.length)]
//     }

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={onClose}
//                 >
//                     <motion.div
//                         className="bg-white dark:bg-gray-800 w-full h-[100vh] md:h-[80vh]  rounded-lg overflow-hidden shadow-xl flex flex-col"
//                         initial={{ scale: 0.9, y: 20 }}
//                         animate={{ scale: 1, y: 0 }}
//                         exit={{ scale: 0.9, y: 20 }}
//                         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Chat header */}
//                         <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-emerald-500 text-white">
//                             <div className="flex items-center">
//                                 <Avatar className="h-10 w-10 mr-3">
//                                     <img src={item.image || "/placeholder.svg"} alt={item.title} />
//                                 </Avatar>
//                                 <div>
//                                     <h3 className="font-semibold">{item.title}</h3>
//                                     <p className="text-sm opacity-90">Chatting with {item.seller}</p>
//                                 </div>
//                             </div>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={onClose}
//                                 className="text-white hover:bg-emerald-600 rounded-full"
//                             >
//                                 <X className="h-5 w-5" />
//                             </Button>
//                         </div>

//                         {/* Chat messages */}
//                         <div className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin">
//                             {messages.map((message) => (
//                                 <motion.div
//                                     key={message.id}
//                                     className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.2 }}
//                                 >
//                                     <div
//                                         className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === "user"
//                                             ? "bg-emerald-500 text-white rounded-br-none"
//                                             : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
//                                             }`}
//                                     >
//                                         <p>{message.text}</p>
//                                         <p
//                                             className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"
//                                                 }`}
//                                         >
//                                             {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Chat input */}
//                         <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
//                             <div className="flex items-center">
//                                 <div className="flex space-x-1 mr-2">
//                                     <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-500 rounded-full">
//                                         <Paperclip className="h-5 w-5" />
//                                     </Button>
//                                     <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-500 rounded-full">
//                                         <ImageIcon className="h-5 w-5" />
//                                     </Button>
//                                     <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-500 rounded-full">
//                                         <Smile className="h-5 w-5" />
//                                     </Button>
//                                 </div>
//                                 <Input
//                                     value={newMessage}
//                                     onChange={(e) => setNewMessage(e.target.value)}
//                                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                                     placeholder="Type a message..."
//                                     className="flex-1 focus-visible:ring-emerald-500"
//                                 />
//                                 <Button
//                                     onClick={handleSendMessage}
//                                     className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
//                                     size="icon"
//                                     disabled={!newMessage.trim()}
//                                 >
//                                     <Send className="h-5 w-5" />
//                                 </Button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     )
// }
