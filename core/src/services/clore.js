// core/src/services/clore.js
import axios from 'axios';
import { env } from '../config/env.js';

// Настраиваем клиент
const api = axios.create({
    baseURL: 'https://api.clore.ai/v1',
    timeout: 7000,
    headers: { Authorization: `Bearer ${env.CLORE_API_KEY}` },
});

// Получение списка офферов
export async function listOffers(filters = {}) {
    try {
        const { data } = await api.get('/offers', { params: filters });
        return data;
    } catch (err) {
        console.error('❌ Ошибка при получении офферов:', err.message);
        return [];
    }
}

// Освобождение аренды
export async function rentRelease(rentalID) {
    try {
        const { data } = await api.post(`/rentals/${rentalID}/release`);
        return data;
    } catch (err) {
        console.error('❌ Ошибка при освобождении аренды:', err.message);
        return { ok: false };
    }
}