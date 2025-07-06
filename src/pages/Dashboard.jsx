import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateRemainingBudget, 
  calculateSavings,
  getExpensesByCategory,
  getMonthlyTrend,
  getTodaysExpenses,
  filterTransactionsByDateRange
} from '../utils/calculations';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { transactions, budgets, profile } = useFinance();
  const [dateFilter, setDateFilter] = useState('');
  
  const filteredTransactions = useMemo(() => {
    if (!dateFilter) return transactions;
    return filterTransactionsByDateRange(transactions, dateFilter, dateFilter);
  }, [transactions, dateFilter]);

  const stats = useMemo(() => ({
    totalIncome: calculateTotalIncome(filteredTransactions),
    totalExpenses: calculateTotalExpenses(filteredTransactions),
    remainingBudget: calculateRemainingBudget(budgets, filteredTransactions),
    savings: calculateSavings(filteredTransactions)
  }), [filteredTransactions, budgets]);

  const categoryData = useMemo(() => {
    const expenses = getExpensesByCategory(filteredTransactions);
    return Object.entries(expenses).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    const trend = getMonthlyTrend(filteredTransactions);
    return Object.entries(trend).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [filteredTransactions]);

  const todaysExpenses = useMemo(() => getTodaysExpenses(transactions), [transactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="date-filter">
          <label>Filter by date: </label>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <button onClick={() => setDateFilter('')}>Clear</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Total Income</h3>
          <p>{profile.currency}{stats.totalIncome.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p>{profile.currency}{stats.totalExpenses.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Remaining Budget</h3>
          <p>{profile.currency}{stats.remainingBudget.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Savings</h3>
          <p>{profile.currency}{stats.savings.toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart">
          <h3>Category-wise Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="todays-expenses">
        <h3>Today's Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {todaysExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{profile.currency}{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
