const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// GET all transactions for logged-in user
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
                          .sort({ date: -1 });
    res.json(transactions);
  } catch(err) { res.status(500).send('Server Error'); }
});

// POST add new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = new Transaction({
      type, amount, category, description, date
  });
    await transaction.save();

    // Check budget alert
    /*
    if (type === 'expense') {
      const month = new Date(date || Date.now())
        .toISOString().slice(0, 7);
      const budget = await Budget.findOne({
        user: req.user.id, category, month
      });
      if (budget) {
        const totalSpent = await Transaction.aggregate([
          { $match: { user: req.user._id || req.user.id,
                      category, type: 'expense',
                      date: { $gte: new Date(month + '-01') } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const spent = totalSpent[0]?.total || 0;
        if (spent > budget.limit) {
          return res.json({ transaction, alert: {
            message: `Budget exceeded for ${category}!`,
            spent, limit: budget.limit },
          });
        }
      }
    }
    */
   
    res.json({ transaction });
  } catch(err) { res.status(500).send('Server Error'); }
});

// DELETE transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Transaction removed' });
  } catch(err) { res.status(500).send('Server Error'); }
});

module.exports = router;
