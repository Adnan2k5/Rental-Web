import { useState, useEffect } from 'react';
import { getLiveTerms } from '../api/terms.api';

export function Terms() {
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const termsData = await getLiveTerms();
                setTerms(termsData);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch terms:", err);
                setError("Failed to load terms and conditions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTerms();
    }, []);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
            {terms && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="mb-4 text-sm text-gray-500">
                        <p>Version: {terms.version}</p>
                        <p>Last Updated: {new Date(terms.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="prose max-w-none">
                        {/* Display the content as is, or parse it if it contains HTML or markdown */}
                        <div dangerouslySetInnerHTML={{ __html: terms.content }} />
                    </div>
                </div>
            )}
        </div>
    );
}