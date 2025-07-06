import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateTotalExpenses, calculateSavings } from '../utils/calculations';
import { toast } from 'react-toastify';

const Profile = () => {
  const { profile, setProfile, transactions } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const lifetimeStats = useMemo(() => ({
    totalExpenses: calculateTotalExpenses(transactions),
    totalSavings: calculateSavings(transactions)
  }), [transactions]);

  const currencies = [
    { code: '₹', name: 'Indian Rupee' },
    { code: '$', name: 'US Dollar' },
    { code: '€', name: 'Euro' },
    { code: '£', name: 'British Pound' },
    { code: '¥', name: 'Japanese Yen' },
    { code: 'C$', name: 'Canadian Dollar' },
    { code: 'A$', name: 'Australian Dollar' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h3>Personal Information</h3>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Default Currency:</label>
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <span>{profile.name}</span>
              </div>
              
              <div className="info-item">
                <label>Email:</label>
                <span>{profile.email}</span>
              </div>
              
              <div className="info-item">
                <label>Default Currency:</label>
                <span>{profile.currency} - {currencies.find(c => c.code === profile.currency)?.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h3>Lifetime Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Total Expenses:</label>
              <span className="expense">{profile.currency}{lifetimeStats.totalExpenses.toLocaleString()}</span>
            </div>
            
            <div className="stat-item">
              <label>Total Savings:</label>
              <span className={lifetimeStats.totalSavings >= 0 ? 'income' : 'expense'}>
                {profile.currency}{lifetimeStats.totalSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
