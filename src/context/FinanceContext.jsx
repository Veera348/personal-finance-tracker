/// context/FinanceContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTransactions, defaultBudgets, defaultProfile } from '../data/defaultData';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('transactions')) || defaultTransactions);
  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem('budgets')) || defaultBudgets);
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('profile')) || defaultProfile);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [transactions, budgets, profile]);

  return (
    <FinanceContext.Provider value={{ transactions, setTransactions, budgets, setBudgets, profile, setProfile }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
