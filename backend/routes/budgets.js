const router = require('express').Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get budgets with spending summary
router.get('/:month', auth, async (req, res) => {
  const budgets = await Budget.find({
    user: req.user.id, month: req.params.month
  });
  const summaries = await Promise.all(budgets.map(async b => {
    const spent = await Transaction.aggregate([
      { $match: { user: b.user, category: b.category,
                  type: 'expense',
                  date: { $gte: new Date(b.month + '-01') } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return { ...b.toObject(), spent: spent[0]?.total || 0,
             overspent: (spent[0]?.total || 0) > b.limit };
  }));
  res.json(summaries);
});

router.post('/', auth, async (req, res) => {
  const budget = new Budget({ ...req.body, user: req.user.id });
  await budget.save();
  res.json(budget);
});

module.exports = router;
