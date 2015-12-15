import Joi from 'joi';

export const schema = {
  _id: Joi.string().guid(),
  type: Joi.string().regex(/plant/),
  userId: Joi.string().guid(),
  title: Joi.string().alphanum().min(1).max(100).required(),
  botanicalName: Joi.string().alphanum().max(100),
  commonName: Joi.string().alphanum().max(100),
  description: Joi.string().alphanum().max(500),
  purchasedDate: Joi.date(),
  plantedDate: Joi.date(),
  price: Joi.number().positive().precision(2),
  tags: Joi.array().items(Joi.string().lowercase()).max(5).unique()
};

export const options = {
  // when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
  abortEarly: false,

  // when true, attempts to cast values to the required types (e.g. a string to a number). Defaults to true.
  // convert: true,

  // when true, allows object to contain unknown keys which are ignored. Defaults to false.
  // allowUnknown: false,

  // when true, ignores unknown keys with a function value. Defaults to false.
  // skipFunctions: false,

  // when true, unknown keys are deleted (only when value is an object or an array). Defaults to false.
  stripUnknown: true,

  // overrides individual error messages, when 'label' is set, it overrides the key name in the error message. Defaults to no override ({}).
  // language:

  // sets the default presence requirements. Supported modes: 'optional', 'required', and 'forbidden'. Defaults to 'optional'.
  // presence: 'optional',

  // provides an external data set to be used in references. Can only be set as an external option to validate() and not using any.options().
  // context:

  // when true, do not apply default values. Defaults to false.
  // noDefaults: false
};

export function validate(obj, cb) {
  Joi.validate(obj, schema, options, cb);
};
