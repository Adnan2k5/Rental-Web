import { motion } from 'framer-motion';
import { Footer } from '../Components/Footer';
import { Navbar } from '../Components/Navbar';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-16">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-700">
                        About Us
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Welcome to Noleggiarmi! We are passionate about making rentals easy, affordable, and accessible for everyone. Our platform connects people who want to rent out their items with those who need them, creating a sustainable and community-driven marketplace.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-2 text-primary">Our Mission</h2>
                            <p className="text-gray-500">
                                To empower people to share resources, reduce waste, and save money by making rentals simple and secure.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-2 text-primary">Our Values</h2>
                            <ul className="text-gray-500 list-disc list-inside space-y-2 text-left">
                                <li>Trust & Safety</li>
                                <li>Community</li>
                                <li>Sustainability</li>
                                <li>Innovation</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-2 text-primary">Why Choose Us?</h2>
                            <ul className="text-gray-500 list-disc list-inside space-y-2 text-left">
                                <li>Wide range of items to rent</li>
                                <li>Easy and secure transactions</li>
                                <li>Supportive customer service</li>
                                <li>Eco-friendly approach</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
