// middlewares/validation_middleware.js
export const validation_middleware = {
    validate_registration_input: (req, res, next) => {
      const { email, password } = req.body;
  
      // Email validation
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
  
      // Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character' });
      }
  
      next();
    },
    
};