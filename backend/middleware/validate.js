function stringField(value, name, { min = 1, max = 500, required = true } = {}) {
  if (value === undefined || value === null || value === '') {
    return required ? `${name} is required` : null;
  }
  if (typeof value !== 'string') return `${name} must be a string`;
  const trimmed = value.trim();
  if (trimmed.length < min) return `${name} must be at least ${min} characters`;
  if (trimmed.length > max) return `${name} must be at most ${max} characters`;
  return null;
}

function emailField(value) {
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'A valid email is required';
  }
  return null;
}

function validateRegistration(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [
    stringField(name, 'Name', { min: 2, max: 80 }),
    emailField(email),
    stringField(password, 'Password', { min: 8, max: 128 }),
  ].filter(Boolean);
  if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });
  req.body.email = email.trim().toLowerCase();
  req.body.name = name.trim();
  next();
}

function validateLogin(req, res, next) {
  const errors = [emailField(req.body?.email), stringField(req.body?.password, 'Password', { max: 128 })].filter(Boolean);
  if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });
  req.body.email = req.body.email.trim().toLowerCase();
  next();
}

module.exports = { stringField, validateRegistration, validateLogin };
