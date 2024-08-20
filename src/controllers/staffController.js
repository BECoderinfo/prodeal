const Staff = require('../models/staff');
const { v4: uuidv4 } = require('uuid');

const createStaff = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate a unique ID
    let StaffId;
    do {
      StaffId = `Staff${uuidv4().slice(0,5).toUpperCase().replace(/[^0-9]/g,'5')}`;
    } while (await Staff.findOne({ StaffId }));

    // Generate a secure password
    const generatePassword = (length = 8) => {
      const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
      const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const specialChars = '@#$%_&';
      const allChars = lowerCase + upperCase + numbers + specialChars;
    
      if (length < 8) {
        throw new Error('Password length should be at least 8 characters.');
      }
    
      let password = '';
      
      // Ensure at least one character from each required set
      password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
      password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
      
      // Fill the rest of the password length with random characters from all sets
      for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
    
      // Shuffle the password to ensure the required characters are randomly distributed
      password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
      return password;
    };

    const password = generatePassword();
    // Create a new staff member
    const staff = new Staff({
      name,
      email,
      phone,
      role,
      password,
      StaffId : StaffId
    });

    // Save the staff member to the database
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Staff ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.find(req.body._id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role } = req.body; 

    const updatedStaff = await Staff.findByIdAndUpdate(
      id, 
      { name, phone, role },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({
      message: 'Staff updated successfully',
      staff: updatedStaff
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
}