

const ProductTransaction = require('./ProductTransaction.js');

const getMonthIndex = (month) => new Date(`${month} 1, 2020`).getMonth() + 1;

const getTransactionsByMonth = async (monthIndex) => {
  return ProductTransaction.aggregate([
    {
      $addFields: {
        month: { $month: "$dateOfSale" }
      }
    },
    {
      $match: {
        month: monthIndex
      }
    }
  ]);
};

const statistics = async (month) => {
  const monthIndex = getMonthIndex(month);
  const transactions = await getTransactionsByMonth(monthIndex);

  const totalSaleAmount = transactions.reduce((sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 0);
  const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
  const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

  return { totalSaleAmount, totalSoldItems, totalNotSoldItems };
};

const barchart = async (month) => {
  const monthIndex = getMonthIndex(month);
  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  const transactions = await getTransactionsByMonth(monthIndex);

  return priceRanges.map(range => ({
    range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
    count: transactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length
  }));
};

const piechart = async (month) => {
  const monthIndex = getMonthIndex(month);
  const transactions = await getTransactionsByMonth(monthIndex);

  const categories = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(categories).map(category => ({
    category,
    count: categories[category]
  }));
};

module.exports = { statistics, barchart, piechart };
