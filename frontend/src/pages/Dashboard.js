import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import TransactionForm from '../components/TransactionForm';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3182CE','#38A169','#E53E3E','#DD6B20','#805AD5'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    // Fetch transactions
    API.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));

    // Fetch budgets
    const currentMonth = new Date().toISOString().slice(0, 7);
    API.get(`/budgets/${currentMonth}`)
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  // 🔹 Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 🔹 Pie chart data
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* 🔥 Budget Alerts */}
      {budgets.filter(b => b.overspent).map(b => (
        <div key={b._id} style={{
          background: '#ffe6e6',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid red',
          borderRadius: '5px'
        }}>
          ⚠ You exceeded {b.category} budget!
          ₹{b.spent} / ₹{b.limit}
        </div>
      ))}

      {/* 🔹 Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#e6fffa', padding: '20px', borderRadius: '10px' }}>
          <h3>Income</h3>
          <p>₹{totalIncome}</p>
        </div>

        <div style={{ background: '#ffe6e6', padding: '20px', borderRadius: '10px' }}>
          <h3>Expense</h3>
          <p>₹{totalExpense}</p>
        </div>

        <div style={{ background: '#e6f0ff', padding: '20px', borderRadius: '10px' }}>
          <h3>Balance</h3>
          <p>₹{totalIncome - totalExpense}</p>
        </div>
      </div>

      {/* 🔹 Transaction Form */}
      <TransactionForm onAdd={handleAdd} />

      {/* 🔹 Transactions List */}
      <h3>Transactions:</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map(t => {
  const budget = budgets.find(b => b.category === t.category);

  return (
    <div key={t._id} style={{ marginBottom: '10px' }}>
      {t.category} - ₹{t.amount}

      {budget && (
        <div style={{ fontSize: '12px', color: 'gray' }}>
          Budget: ₹{budget.spent} / ₹{budget.limit}
        </div>
      )}
    </div>
  );
})
      )}

      {/* 🔹 Pie Chart */}
      <h3>Expenses by Category</h3>
      {pieData.length > 0 && (
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}