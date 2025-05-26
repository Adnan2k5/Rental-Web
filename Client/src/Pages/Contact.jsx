import React from "react";

export const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Contact Us</h2>
                <p className="text-gray-600 text-center mb-6">We'd love to hear from you! Reach out to us using the information below.</p>
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
                    <p className="text-gray-600">Email: <a href="mailto:support@rentalweb.com" className="text-indigo-600 hover:underline">support@rentalweb.com</a></p>
                    <p className="text-gray-600">Phone: <a href="tel:+1234567890" className="text-indigo-600 hover:underline">+1 (234) 567-890</a></p>
                </div>
            </div>
        </div>
    );
}


