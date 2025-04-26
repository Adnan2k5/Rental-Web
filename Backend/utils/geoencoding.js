import axios from 'axios';

/**
 * Get latitude and longitude from an address using Google Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>} - The latitude and longitude
 */
export async function getLatLongFromAddress(address) {
    const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    try {
        const response = await axios.get(url, {
            params: {
                address,
                key: apiKey
            }
        });
        const results = response.data.results;
        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('No results found for the given address');
        }
    } catch (error) {
        console.error('Error fetching geocode data:', error.message);
    }
}
