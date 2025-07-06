
/// data/defaultData.js
export const defaultTransactions = [
  {
    id: 1,
    type: 'Income',
    amount: 20000,
    category: 'Salary',
    date: '2025-07-01',
    description: 'Monthly salary',
  },
  {
    id: 2,
    type: 'Expense',
    amount: 3000,
    category: 'Groceries',
    date: '2025-07-02',
    description: 'Vegetables and snacks',
  },
];

export const defaultBudgets = [
  { category: 'Groceries', amount: 10000 },
  { category: 'Transport', amount: 5000 },
];

export const defaultProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  currency: '₹',
};
