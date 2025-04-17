import { ArrowLeft, MoreVertical, PhoneCall, Video } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Avatar } from "../../components/ui/avatar"
import { Tooltip } from "../../Components/ui/tooltip"

export default function Header({ productName, ownerName, productUrl }) {
    const navigateBack = () => {
        window.history.back();
    };

    return (
        <div className="bg-gradient-to-r from-[#151823] to-[#1E2131] border-b border-[#4D39EE]/20 p-4 md:px-6 lg:px-8 sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-[#2A2D3A] hover:text-[#4D39EE] transition-all duration-300"
                        onClick={navigateBack}
                    >
                        <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <div className="flex items-center gap-3 md:gap-4">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-[#4D39EE] ring-offset-2 ring-offset-[#191B24] transition-all duration-300 hover:scale-105">
                            {productUrl ? (
                                <img src={productUrl} alt={productName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="font-bold text-white text-lg md:text-xl bg-gradient-to-br from-[#4D39EE] to-[#4FC3F7] h-full w-full flex items-center justify-center">
                                    {productName?.charAt(0)}
                                </div>
                            )}
                        </Avatar>
                        <div className="transition-all duration-300 hover:translate-x-1">
                            <h1 className="text-white font-bold text-lg md:text-xl lg:text-2xl tracking-tight">{productName}</h1>
                            <p className="text-gray-400 text-sm md:text-base flex items-center gap-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                {ownerName}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip content="More options">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2D3A] hover:text-[#4D39EE] transition-all duration-300">
                            <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
