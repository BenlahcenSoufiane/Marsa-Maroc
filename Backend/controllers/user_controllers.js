const { sign } = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {generateToken} = require('../auth')
const User = require('../models/User');



//SIGN UP//
const signup = async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;
  
    console.log('Signup request received:', { email, role, firstName, lastName });
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log('Email already exists:', email);
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword, role: role || 'user', firstName, lastName });
  
      console.log('New user created:', newUser);
      res.status(201).json({ success: true, message: 'User added successfully', user: newUser });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  };



  //LOGIN//
const login =  async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login request received:', { email, password }); // For debugging
    
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      console.log('Retrieved user from database:', user.password); // For debugging
      
      if (!password) {
        console.log('Password not provided');
        return res.status(400).json({ success: false, message: 'Password not provided' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch); // For debugging
      
      if (!passwordMatch) {
        console.log('Incorrect password for user:', email);
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
  
      const token = generateToken({ id: user.id,email:user.email , role: user.role ,firstName: user.firstName,lastName: user.lastName });
      console.log('User logged in successfully:', email,user.role,user.firstName,user.lastName); // For debugging
      res.status(200).json({ success: true, token, role: user.role, firstName:user.firstName , lastName: user.lastName}); // Include the role in the response
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  };



//GET USER BY ID //
const getUserId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching the users.' });
    }
  };



//USER UPDATE//
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findByPk(id);
      
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's profile
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
  
      // Save the changes to the database
      await user.save();
  
      // Respond with success message
      res.status(200).json({ success: true, message: 'User profile updated successfully', user });
    } catch (error) {
      // Handle errors
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'An error occurred while updating user profile.' });
    }
  };


// GET USERS //
const getAllUser = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
  };


//DELETE USER //
const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
  };

//USER  COUNT//
const countUser = async (req, res) => {
    try {
      const usersCount = await User.count();
      res.status(200).json({ usersCount });
    } catch (error) {
      console.error('Error fetching users count:', error);
      res.status(500).json({ error: 'An error occurred while fetching the users count.' });
    }
  };

  module.exports = {
    signup,
    login,
    getAllUser,
    deleteUser,
    countUser,
    updateUser,
    getUserId,
  };
  