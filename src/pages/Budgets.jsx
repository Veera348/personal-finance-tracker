import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getExpensesByCategory } from '../utils/calculations';
import { toast } from 'react-toastify';

const Budgets = () => {
  const { budgets, setBudgets, transactions, profile } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });

  const expensesByCategory = useMemo(() => getExpensesByCategory(transactions), [transactions]);

  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      return {
        ...budget,
        spent,
        percentage: Math.min(percentage, 100),
        isOverspent: spent > budget.amount
      };
    });
  }, [budgets, expensesByCategory]);

  useEffect(() => {
    budgetProgress.forEach(budget => {
      if (budget.isOverspent) {
        toast.warn(`Budget exceeded for ${budget.category}! Spent: ${profile.currency}${budget.spent}, Budget: ${profile.currency}${budget.amount}`);
      }
    });
  }, [budgetProgress, profile.currency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => 
        b.category === editingBudget.category ? budgetData : b
      ));
      toast.success('Budget updated successfully');
    } else {
      const existingBudget = budgets.find(b => b.category === budgetData.category);
      if (existingBudget) {
        toast.error('Budget for this category already exists');
        return;
      }
      setBudgets([...budgets, budgetData]);
      toast.success('Budget added successfully');
    }

    resetForm();
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData(budget);
    setShowForm(true);
  };

  const handleDelete = (category) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.category !== category));
      toast.success('Budget deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({ category: '', amount: '' });
    setEditingBudget(null);
    setShowForm(false);
  };

  return (
    <div className="budgets">
      <div className="budgets-header">
        <h2>Budget Management</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Budget
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingBudget ? 'Edit Budget' : 'Add Budget'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category:</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  disabled={editingBudget}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Monthly Budget Amount:</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingBudget ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="budget-list">
        {budgetProgress.map(budget => (
          <div key={budget.category} className={`budget-card ${budget.isOverspent ? 'overspent' : ''}`}>
            <div className="budget-header">
              <h3>{budget.category}</h3>
              <div className="budget-actions">
                <button onClick={() => handleEdit(budget)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(budget.category)} className="btn-delete">Delete</button>
              </div>
            </div>
            
            <div className="budget-info">
              <p>Budget: {profile.currency}{budget.amount.toLocaleString()}</p>
              <p>Spent: {profile.currency}{budget.spent.toLocaleString()}</p>
              <p>Remaining: {profile.currency}{Math.max(0, budget.amount - budget.spent).toLocaleString()}</p>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${budget.percentage}%`,
                  backgroundColor: budget.isOverspent ? '#ff4444' : '#4CAF50'
                }}
              ></div>
            </div>
            
            <p className="progress-text">
              {budget.percentage.toFixed(1)}% used
              {budget.isOverspent && ' (OVER BUDGET!)'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budgets;
