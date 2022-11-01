const getAmount = (prices, currency) => {
    return prices.find(({ currency: { symbol } }) => symbol === currency).amount;
}

export default getAmount;