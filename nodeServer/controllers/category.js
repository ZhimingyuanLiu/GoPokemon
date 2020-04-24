const Category = require('../models/category');
const {
  errorHandler
} = require('../utils/ErrorDB');

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({
        error: 'Category does not exist'
      });
    }
    req.category = category;
    next();
  } catch (err) {
    res.status(400).json({
      error: 'Category does not exsit'
    });
  }
};

exports.create = async (req, res) => {
  try {
    const category = new Category(req.body);
    const data = await category.save();
    res.json({
      data
    });
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err)
    });
  }
};

exports.read = async (req, res) => {
  return res.json(req.category);
};

exports.update = async (req, res) => {
  try {
    console.log('req.body', req.body);
    console.log('category update param', req.params.categoryId);
    const category = req.category;
    category.name = req.body.name;
    const data = await category.save();
    res.json(data);
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err)
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const category = req.category;
    const data = await category.remove();
    res.json({
      message: 'Category deleted'
    });
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err)
    });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err)
    });
  }
};