"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

const LanguageSelector = ({ className, direction = "down" }) => {
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

    const UKFlag = () => (
        <svg className="h-4 w-6 mr-1" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
            <clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
            <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
            <g clipPath="url(#s)">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
        </svg>
    )

    const ItalyFlag = () => (
        <svg className="h-4 w-6 mr-1" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
            <rect width="1" height="2" fill="#009246" />
            <rect width="1" height="2" x="1" fill="#fff" />
            <rect width="1" height="2" x="2" fill="#CE2B37" />
        </svg>
    )

    return (
        <div className="relative">
            <button
                className={`flex items-center text-sm ${className} hover:text-primary focus:outline-none`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Change language. Current language: ${i18n.language === "it" ? "Italian" : "English"}`}
            >
                {i18n.language === "it" ? <ItalyFlag /> : <UKFlag />}
                <span>{i18n.language === "it" ? "IT" : "EN"}</span>
            </button>

            {isOpen && (
                <div
                    className={`absolute ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"} right-0 bg-white shadow-lg rounded-md py-1 w-32 z-10 border`}
                >
                    <div className="px-3 py-1 text-xs font-medium text-black border-b border-black">
                        {t("language.select")}
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`flex items-center w-full text-left px-3 py-1 text-sm hover:bg-gray-50 ${i18n.language === lang.code
                                    ? "text-primary font-medium"
                                    : "text-gray-700"
                                }`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            {lang.code === "en" ? <UKFlag /> : <ItalyFlag />}
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageSelector
