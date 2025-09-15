/** Упрощённые расчёты доходности/порогов */
function incomePerHour({ hashrate, rewardPerHash, priceCoinUSD }) {
    const coinsPerHour = hashrate * rewardPerHash;
    return coinsPerHour * priceCoinUSD;
}
function shouldRent({ serverCostPerHour, incomePerHour, marginMin = 0.15 }) {
    const profit = incomePerHour - serverCostPerHour;
    const margin = incomePerHour ? profit / incomePerHour : -1;
    return { profit, margin, decision: profit > 0 && margin >= marginMin };
}
module.exports = { incomePerHour, shouldRent };