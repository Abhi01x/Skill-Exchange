const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { createSkill, getSkills, getSkillsByUser } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

const validateSkill = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
];

const validateRequest = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.route('/')
  .post(protect, validateSkill, validateRequest, createSkill)
  .get(getSkills);

router.route('/user/:userId').get(getSkillsByUser);

module.exports = router;
