exports.userSignupValidator = (req, res, next) => {
  console.log('test');
  req.check('name', 'Name is required').notEmpty();
  req
    .check('email', 'Email must be between 3 to 32 charcaters')
    .matches(/.+\@.+..+/)
    .withMessage('Eamil must contain @')
    .isLength({
      min: 4,
      max: 32
    });
  req.check('password', 'password is required').notEmpty();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Passaord at least 6 chars')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
