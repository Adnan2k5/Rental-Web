"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"

const LanguageSelector = ({ className }) => {
    const { i18n, t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: "en", name: t("language.en") },
        { code: "it", name: t("language.it") },
    ]

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        localStorage.setItem("language", lng)
        window.location.reload()
        setIsOpen(false)
    }

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language")
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage)
        }
    }, [i18n])

    return (
        <div className="relative">
            <button
                className={`flex items-center text-sm ${className}  hover:text-primary focus:outline-none`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Globe className="h-4 w-4 mr-1" />
                <span>{i18n.language === "it" ? "IT" : "EN"}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-md py-1 w-32 z-10 border">
                    <div className="px-3 py-1 text-xs font-medium text-black border-b border-black">
                        {t("language.select")}
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`block w-full text-left px-3 py-1 text-sm hover:bg-gray-50 ${i18n.language === lang.code ? "text-primary font-medium" : "text-gray-700"
                                }`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageSelector
