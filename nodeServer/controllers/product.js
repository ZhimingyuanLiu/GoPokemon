const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('fs');
const {
  errorHandler
} = require('../utils/ErrorDB');

const _ = require('lodash');

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(400).json({
        error: 'Product not fount'
      });
    }
    req.product = product;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Product not fount'
    });
  }
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  console.log(req.product);
  return res.json(req.product);
};
exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
    } = fields;
    console.log(name + ',' + description + ',' + price + ',' + quantity + ',' + shipping);
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be smaller than 1mb'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        console.log('PRODUCT CREATE ERROR ', err);
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};

exports.remove = async (req, res) => {
  const product = req.product;
  try {
    const deletedProduct = await product.remove();
    console.log(deletedProduct);
    res.json({
      message: 'Product deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err)
    });
  }
};

exports.update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
    } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be smaller than 1mb'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        console.log('PRODUCT CREATE ERROR ', err);
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};

exports.list = async (req, res) => {
  try {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const products = await Product.find()
      .select('-photo')
      .populate('category')
      .sort([
        [sortBy, order]
      ])
      .limit(limit);
    res.send(products);
  } catch (err) {
    res.status(400).json({
      error: 'Products not found'
    });
  }
};

exports.listRelated = async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const products = await Product.find({
        _id: {
          $ne: req.product
        },
        category: req.product.category
      })
      .limit(limit)
      .populate('category', '_id name');
    res.json(products);
  } catch (err) {
    res.status(400).json({
      error: 'Products not found'
    });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(400).json({
      error: 'Categories not found'
    });
  }
};

exports.listBySearch = async (req, res) => {
  try {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === 'price') {
          // gte -  greater than price [0-10]
          // lte - less than
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }
    console.log('test');
    const data = await Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .sort([
        [sortBy, order]
      ])
      .skip(skip)
      .limit(limit);
    res.json({
      size: data.length,
      data
    });
  } catch (err) {
    res.status(400).json({
      error: 'Products not found'
    });
  }
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
      $options: 'i'
    };
    // assigne category value to query.category
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(products);
    }).select('-photo');
  }
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map(item => {
    return {
      updateOne: {
        filter: {
          _id: item._id
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count
          }
        }
      }
    };
  });

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update product'
      });
    }
    next();
  });
};