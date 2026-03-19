import React, { useState, useEffect } from 'react';
import API from '../utils/api';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    category: '',
    limit: ''
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await API.get(`/budgets/${currentMonth}`);
      setBudgets(res.data);
    } catch (err) {
      console.error("Budget fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/budgets', {
        category: form.category,
        limit: Number(form.limit),
        month: currentMonth
      });

      setForm({ category: '', limit: '' });
      loadBudgets();
    } catch (err) {
      console.error("Budget save error:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Budgets</h1>

      {/* 🔥 FORM (ALWAYS VISIBLE) */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          placeholder="Limit"
          value={form.limit}
          onChange={e => setForm({ ...form, limit: e.target.value })}
        />

        <button type="submit">Set Budget</button>
      </form>

      {/* 🔹 LIST */}
      <h3>Budget List</h3>

      {budgets.length === 0 ? (
        <p>No budgets yet</p>
      ) : (
       budgets.map(b => (
  <div key={b._id} style={{
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    background: b.overspent ? '#ffe6e6' : '#e6fffa'
  }}>
    {b.category} → ₹{b.spent} / ₹{b.limit}

    {b.overspent && (
      <div style={{ color: 'red' }}>⚠ Over Budget</div>
    )}
  </div>
)))}
    </div>
  );
}