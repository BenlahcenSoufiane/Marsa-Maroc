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
  const { MLE, Name, fonction, Affectation_Initiale, Affectation_Finale, Observation } = req.body;

  try {
      const user = await User.findOne({ where: { MLE } });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      if (user.id !== parseInt(id, 10)) {
          return res.status(400).json({ error: 'ID does not match the MLE' });
      }

      user.Name = Name;
      user.fonction = fonction;
      user.Affectation_Initiale = Affectation_Initiale; // Updated to match model
      user.Affectation_Finale = Affectation_Finale;
      user.Observation = Observation;

      await user.save();

      res.status(200).json({ success: true, message: 'User profile updated successfully', user });
  } catch (error) {
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
    getAllUser,
    deleteUser,
    countUser,
    updateUser,
    getUserId,
  };
  