export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateRemainingBudget = (budgets, transactions) => {
  const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalBudget - totalExpenses;
};

export const calculateSavings = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalIncome - totalExpenses;
};

export const getExpensesByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'Expense');
  return expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});
};

export const getMonthlyTrend = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'Expense');
  return expenses.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {});
};

export const getTodaysExpenses = (transactions) => {
  const today = new Date().toISOString().split('T')[0];
  return transactions.filter(t => t.type === 'Expense' && t.date === today);
};

export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(t => t.date >= startDate && t.date <= endDate);
};
