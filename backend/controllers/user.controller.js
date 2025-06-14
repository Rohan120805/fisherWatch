import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const user = new User({ userId, password });
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.userId;
    
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkAuth = (req, res) => {
    if (req.session.userId) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
};