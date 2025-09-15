const axios = require('axios');
const env = require('../config/env');
const api = axios.create({
    baseURL: 'https://api2.hiveos.farm/api/v2',
    timeout: 15000,
    headers: { Authorization: `Bearer ${env.HIVEOS_API_KEY}` }
});
async function minerStatus(_workerId) { /* const {data} = await api.get(`/workers/${id}/stats`); */ return { status: 'unknown' }; }
module.exports = { minerStatus };