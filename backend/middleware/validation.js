const validateRequest = (schema) => {
  return (req, res, next) => {
    // Basic validation - you can expand this with libraries like Joi or Yup
    const errors = [];

    // Check required fields
    if (schema.required) {
      schema.required.forEach(field => {
        if (!req.body[field]) {
          errors.push(`${field} is required`);
        }
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
  };
};

module.exports = {
  validateRequest
};