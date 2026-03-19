import React, { useState } from 'react';
import API from '../utils/api';

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post('/transactions', form);
    onAdd(res.data.transaction);

    setForm({
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      <select
        value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      />

      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <button type="submit">Add</button>
    </form>
  );
}