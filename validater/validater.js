const { check } = require('express-validator');

exports.createPostValidator = [
    check('title')
        .notEmpty().withMessage("title is require")
        .isLength({ min: 5, max:20 }).withMessage("length of title must be min 5 and max 20"),
    check('body')
        .notEmpty().withMessage("body is require")
        .isLength({ min: 5 }).withMessage("length of body must be min 5 and max 1000"),
]

exports.userSignUpValidation = [
    check('name')
        .notEmpty().withMessage("name is require"),
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('please enter a valid email'),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
        .matches(/\d/).withMessage('must contain a number')
]