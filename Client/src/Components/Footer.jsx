import { Headset } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} {t('footer.copyright')}
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <Link to="/dashboard/tickets" className="text-sm text-gray-500 hover:text-primary">
                            <Headset className="h-4 w-4 inline-block mr-1" />
                        </Link>
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            {t('footer.terms')}
                        </Link>
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            {t('footer.privacy')}
                        </Link>
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            {t('footer.support')}
                        </Link>
                    </div>
                    <LanguageSelector />
                </div>

            </div>
        </footer>

    )
}
