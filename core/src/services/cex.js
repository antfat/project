/** Получение цены монеты с биржи (заглушка) */
async function priceUSD(symbol = 'CLORE') {
    // TODO: подключить реальный источник (Coingecko/CoinPaprika/диапазон бирж)
    return { symbol, usd: 0.05 };
}
module.exports = { priceUSD };