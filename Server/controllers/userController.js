
const User = require('../models/userSchema');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const emailAddress = process.env.emailAddress;
const emailPassword = process.env.emailPassword;

//Function to Hash Password
const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

//Function to Create Random Verification Code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


//Function to Register the user
const registerUser = async(req, res) => {
    const { username, email, password, firstName, lastName, dob } = req.body;
    try {
        // Check if required fields are provided.
        if (!username || !email || !password || !firstName || !lastName ||!dob) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Existing Username or Email' });
        }

        // Generate a random salt
        const salt = crypto.randomBytes(16).toString('hex');

        // Hash the password using the salt
        const hashedPassword = hashPassword(password, salt);

        // Create a new user instance
        const newUser = new User({
            userID: uuidv4(),
            username,
            email,
            password: hashedPassword,
            salt,
            name: {firstName, lastName},
            dob
        });

        // Save the user to the database
        await newUser.save();
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


//Function to login the user
const loginUser = async(req, res) => {
    const {usernameOrEmail, password} = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]});
    
        if (!user) {
          return res.status(401).json({ error: 'Invalid Username or Email Address' });
        }
    
        // Hash the input password with the retrieved salt
        const hashedPassword = hashPassword(password, user.salt);

        if (hashedPassword !== user.password) {
            return res.status(401).json({ error: 'Invalid Password' });
          }    
          
        // Passwords match, user is authenticated
        res.status(200).json({ message: 'User authenticated successfully' });
         } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
         }
} 

const sendVerificationCode = async (req, res) => {
    try {
      const email = req.body.email;
  
      if (!email) {
        return res.status(400).json({ error: 'Please input the e-mail' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'No existing user with the provided e-mail' });
      }
  
      // Extract username from the found user
      const firstName = user.name.firstName;
  
      // Generate verification code
      const verificationCode = generateVerificationCode();
  
      // Update user's verification code in the database
      user.verificationCode = verificationCode;
      await user.save();
  
      // Send email with verification code
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailAddress, 
          pass: emailPassword, 
        },
      });
  
      const mailOptions = {
        from: 'Trek Tango',
        to: user.email,
        subject: 'Verification Code',
        text: `Dear ${firstName},
  
  Thank you for choosing Trek Tango! To ensure the security of your account, we require verification before proceeding with any changes, including password resets.
  
  *Please use the following verification code to confirm your identity: ${verificationCode}.*
  
  Once you've received this email, kindly enter the provided code in the appropriate field within the Trek Tango application. This step helps us confirm that you are the rightful owner of the account and helps safeguard your personal information.
  
  If you did not initiate this action or have any concerns regarding your account security, please contact our support team immediately at (Insert e-mail address and phone number here). We're here to assist you and ensure your experience with Trek Tango remains safe and enjoyable.
  
  Thank you for your cooperation in maintaining the security of your account.
  
  Best regards,
  
  Team Trek Tango`,
      };
      
       
      await transporter.sendMail(mailOptions);
     
      res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('There was an error encountered when sending the verification code:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  }

const forgotPassword = async(req, res) => {
        const { email, verificationCode, newPassword } = req.body;
          
            try {
              // Find user by email
              const user = await User.findOne({ email });
          
              if (!user) {
                return res.status(404).json({ error: 'User not found' });
              }
          
              // Check if verification code is null
              if (!user.verificationCode) {
                return res.status(400).json({ error: 'The verification code has not been generated' });
              }
          
              // Check if verification code matches
              if (verificationCode !== user.verificationCode) {
                return res.status(401).json({ error: 'Incorrect Verification Code' });
              }
          
              // Reset verification code to null
              user.verificationCode = null;
          
              // Save the updated user to the database
              await user.save();
          
              // Change password
              const changePasswordResult = await resetPassword(user.username, newPassword);
          
              if (!changePasswordResult.success) {
                return res.status(500).json({ error: 'Failed to change password' });
              }
          
              return res.status(200).json({ message: 'Password has been changed successfully' });
            } catch (error) {
              console.error('Error resetting password:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
}

const resetPassword = async (username, newPassword) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username });
  
        if (!user) {
            return { success: false, error: 'No user found with the  given username' };
        }
  
        // Generate a new salt and hash the new password
        const newSalt = crypto.randomBytes(16).toString('hex');
        const hashedNewPassword = hashPassword(newPassword, newSalt);
  
        // Update the user's password and salt
        user.password = hashedNewPassword;
        user.salt = newSalt;
  
        // Save the updated user to the database
        await user.save();
  
        return { success: true, message: 'The password has been resetted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Internal Server Error' };
    }
  };

  const getIdByUsernameOrEmail = async (req, res) => {
    try {
      const { usernameOrEmail } = req.params; // Assuming username is passed in the query parameters
  
      // Check if username is provided
      const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]});
  
      // Call the method to find userid by username
      const userID = await user.userID;
  
      if (userID) {
        // If userid found, send it in the response
        res.status(200).json({ userID: userID });
      } else {
        // If userid not found, send appropriate error response
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      // Handle any errors
      console.error('Error fetching userid by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
      


module.exports = {registerUser, loginUser, sendVerificationCode, forgotPassword, getIdByUsernameOrEmail};
    