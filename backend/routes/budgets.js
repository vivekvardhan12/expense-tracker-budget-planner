const router = require('express').Router();
// const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get budgets with spending summary
router.get('/:month', async (req, res) => {
  const budgets = await Budget.find({
     month: req.params.month
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

router.post('/', async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG

    const budget = new Budget({
      category: req.body.category,
      limit: Number(req.body.limit), // 🔥 IMPORTANT
      month: req.body.month
    });

    await budget.save();

    res.json(budget);

  } catch (err) {
    console.log("ERROR:", err); // 🔥 SEE REAL ERROR
    res.status(500).send(err.message);
  }
});

module.exports = router;
