// Simple validation utility (we'll use Joi later)
export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

// Validation middleware
export const validateUserInput = (req, res, next) => {
  const { username, email, password } = req.body;

  const errors = [];

  if (username && !validateUsername(username)) {
    errors.push("Username must be between 3 and 30 characters");
  }

  if (email && !validateEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (password && !validatePassword(password)) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};
