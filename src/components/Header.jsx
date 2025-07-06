/// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <h1>Personal Finance Tracker</h1>
    <nav>
      <Link to="/">Dashboard</Link> | 
      <Link to="/transactions">Transactions</Link> | 
      <Link to="/budgets">Budgets</Link> | 
      <Link to="/profile">Profile</Link>
    </nav>
  </header>
);

export default Header;