import { body } from 'express-validator';

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const RECOVERY_EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const fullNameValidation = body('fullName')
  .isString()
  .withMessage('Name should be string')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 3, max: 50 })
  .withMessage('Full name must be between 3 and 50 characters');

const birthDateValidation = body('birthDate')
  .isString()
  .withMessage('BirthDate should be string')
  .trim()
  .notEmpty()
  .withMessage('BirthDate is required');

const emailValidation = body('email')
  .isString()
  .withMessage('Email should be string')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .matches(EMAIL_PATTERN)
  .withMessage('Invalid email format')
  .isLength({ max: 100 })
  .withMessage('Email is too long');

const passwordValidation = body('password')
  .isString()
  .withMessage('Password should be string')
  .trim()
  .notEmpty()
  .withMessage('Password is required');
// .isLength({min: 6, max: 20})
// .withMessage("Password must be between 6 and 20 characters");

export const registrationInputValidation = [
  fullNameValidation,
  birthDateValidation,
  emailValidation,
  passwordValidation,
];

export const loginInputValidation = [emailValidation, passwordValidation];
