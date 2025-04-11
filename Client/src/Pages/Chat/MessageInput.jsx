import { useState } from "react"
import { Send, Paperclip, Smile } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSendMessage(message)
        setMessage("")
    }

    return (
        <div className="p-4 border-t border-[#4D39EE]/20 bg-[#191B24]">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Button type="button" variant="ghost" className="text-[#4FC3F7] h-[2rem]">
                    <Paperclip className="h-[2rem]" />
                </Button>
                <div className="flex-1 relative">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-[#2A2D3A] border-none h-[2rem] placeholder:text-xl py-5  text-white focus-visible:ring-[#4D39EE] focus-visible:ring-offset-0"
                    />
                </div>
                <Button
                    type="submit"
                    className="bg-[#4D39EE] hover:bg-[#4D39EE]/90 text-white rounded-full h-[3rem] w-[3rem] p-0 flex items-center justify-center"
                >
                    <Send className="h-10 w-10" />
                </Button>
            </form>
        </div>
    )
}
