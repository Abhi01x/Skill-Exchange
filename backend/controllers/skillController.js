const Skill = require('../models/Skill');

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    const skill = new Skill({
      title,
      description,
      category,
      userId: req.user._id,
    });

    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all skills with optional search
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const skills = await Skill.find({ ...keyword, ...category }).populate('userId', 'name rating');
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills by user
// @route   GET /api/skills/user/:userId
// @access  Public
const getSkillsByUser = async (req, res, next) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillsByUser,
};
