const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'your-secret-key-for-development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory user storage (for development only)
const users = new Map();

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );
}

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Validate that fields are strings
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || 
        typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'All fields must be valid strings'
      });
    }

    // Trim and validate email format
    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    if (users.has(trimmedEmail)) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(422).json({
        detail: 'Password must be at least 8 characters long'
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(422).json({
        detail: 'Password must contain at least one uppercase letter'
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(422).json({
        detail: 'Password must contain at least one lowercase letter'
      });
    }

    if (!/\d/.test(password)) {
      return res.status(422).json({
        detail: 'Password must contain at least one number'
      });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({
        detail: 'Password processing failed'
      });
    }

    // Create user
    const user = {
      id: Date.now().toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      kycStatus: 'pending',
      isVerified: false,
      hasCompletedInvestmentProfile: false
    };

    users.set(trimmedEmail, user);

    // Generate token
    let token;
    try {
      token = generateToken(user);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        detail: 'Authentication token generation failed'
      });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      access_token: token,
      token_type: 'Bearer',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Registration error stack:', error.stack);
    res.status(500).json({
      detail: 'Registration failed due to server error'
    });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(401).json({
        message: 'Email and password are required'
      });
    }

    // Validate that fields are strings
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(401).json({
        message: 'Email and password must be valid strings'
      });
    }

    // Trim and validate email format
    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(401).json({
        message: 'Please provide a valid email address'
      });
    }

    // Find user
    const user = users.get(trimmedEmail);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Verify password
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({
        detail: 'Password verification failed'
      });
    }
    
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    let token;
    try {
      token = generateToken(user);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        detail: 'Authentication token generation failed'
      });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      access_token: token,
      token_type: 'Bearer',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Login error stack:', error.stack);
    res.status(500).json({
      detail: 'Login failed due to server error'
    });
  }
});

// Get current user endpoint
app.get('/auth/me', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({
        detail: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      detail: 'Internal server error'
    });
  }
});

// Update investment profile status
app.patch('/user/investment-profile', authenticateToken, (req, res) => {
  try {
    const { hasCompletedInvestmentProfile } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        detail: 'User not found'
      });
    }

    user.hasCompletedInvestmentProfile = hasCompletedInvestmentProfile;
    user.updatedAt = new Date().toISOString();
    users.set(req.user.email, user);

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      detail: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /auth/register - User registration');
  console.log('  POST /auth/login - User login');
  console.log('  GET /auth/me - Get current user');
  console.log('  PATCH /user/investment-profile - Update investment profile');
  console.log('  GET /health - Health check');
});

module.exports = app;