import { ArrowLeft, MoreVertical } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Avatar } from "../../components/ui/avatar"

export default function Header({ item }) {
    return (
        <div className="bg-[#191B24] border-b border-[#4D39EE]/20 p-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                    <Button variant="ghost" size="icon" className="text-white">
                        <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <div className="flex items-center gap-3 md:gap-4">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-[#4D39EE] to-[#4FC3F7] border-2 border-[#191B24]">
                            <div className="font-bold text-white text-lg md:text-xl">{item?.name?.charAt(0)}</div>
                        </Avatar>
                        <div>
                            <h1 className="text-white font-bold text-lg md:text-xl lg:text-2xl">{item?.name}</h1>
                            <p className="text-gray-400 text-sm md:text-base">{item?.owner}</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white">
                    <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
            </div>
        </div>
    )
}
