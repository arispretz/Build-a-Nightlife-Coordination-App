const axios = require('axios');
const Bar = require('../models/bar');
const fourSquareApiKey = process.env.FOURSQUARE_PLACES_API_KEY;

const fourSquareClient = axios.create({
    baseURL: 'https://api.foursquare.com/v3/places/search',
    headers: {
        Authorization: `Bearer ${fourSquareApiKey}`,
    },
});

const searchBars = async (req, res) => {
    const { location } = req.query;
    try {
        const response = await fourSquareClient.get('/search', {
            params: {
                query: 'bars',
                near: location,
                categories: 'bars',
            },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching bars from FourSquare API', error);
        res.status(500).json({ message: 'Error fetching bars from FourSquare API' });
    }
};

const attendBar = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const bar = await Bar.findById(id);
        if (!bar) return res.status(404).json({ message: 'Bar not found' });

        if (!bar.attendees.includes(userId)) {
            bar.attendees.push(userId);
            await bar.save();
            res.json({ message: `User attending bar with id ${id}` });
        } else {
            res.status(400).json({ message: 'User already attending this bar' });
        }
    } catch (error) {
        console.error('Error attending bar:', error);
        res.status(500).json({ message: 'Error attending bar' });
    }
};

module.exports = { searchBars, attendBar };
