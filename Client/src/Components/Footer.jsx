import React from 'react'
import { Link } from 'react-router-dom'
export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Rental. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            Terms
                        </Link>
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            Privacy
                        </Link>
                        <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>

    )
}
