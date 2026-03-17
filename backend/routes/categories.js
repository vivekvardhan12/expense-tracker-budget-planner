const router = require('express').Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

router.post('/', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
});

router.put('/:id', auth, async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json(category);
});

router.delete('/:id', auth, async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ msg: 'Category deactivated' });
});

module.exports = router;
