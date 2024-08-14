const Admin = require('../models/Admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const admincreate = async function(req, res) {
  try {
    
    //   let adminData = await Admin.create(req.body)
    
      const { email, password } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 12);

   
      const admin = new Admin({
          email,
          password: hashedPassword,
      });

      await admin.save();

      res.status(201).json({
        status:"Succses",
        massage:"Signup Succesfully",
        
      })
    } catch (error) {
        console.log(error);
      res.status(404).json({
        status:"Fail",
        massage: error.massage
      }
      )
    }
}

const adminlogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const adminModel = await Admin.findOne({ email });
   
      if (!adminModel) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, adminModel.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      var admintoken = jwt.sign({ adminModel  }, 'Prodeals');

      // Rest of the code...

      res.status(200).json({ message: 'Login successful', admintoken });

  } catch (error) {
      console.log('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {adminlogin,admincreate};
// module.exports = admincreate;