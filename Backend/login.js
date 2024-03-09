const url = "mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/";
const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

mongoose.connect(url);

//create connection

const connection = mongoose.connection;

const app = express();

// Connect to MongoDB (Make sure to replace 'your-mongodb-uri' with your actual MongoDB connection URI)
mongoose.connect(url);

// Define a mongoose schema for the user data
const userSchema = new mongoose.Schema({
    userID: { type: String, default: uuidv4, required: true }, 
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }, // Salt field added
    profilePic: { type: String, default: null },
    name: {
      firstName: { type: String },
      lastName: { type: String }
    },
    dob: { type: Date },
    verificationCode: { type: String, default: null, minlength: 6, maxlength: 6 }
  });

// Hashing function
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// POST /register route
app.post('/register', async (req, res) => {
    const { username, email, password, name, dob } = req.body;
  
    try {
      // Generate a random salt
      const salt = crypto.randomBytes(16).toString('hex');
  
      // Hash the password using the salt
      const hashedPassword = hashPassword(password, salt);
  
      // Create a new user instance
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        salt,
        name,
        dob
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const User = mongoose.model('User', userSchema);

// POST /login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Hash the input password with the retrieved salt
    const hashedPassword = hashPassword(password, user.salt);

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Passwords match, user is authenticated
    res.status(200).json({ message: 'User authenticated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.put('/users/send-verification-email', async (req, res) => {
  const email = req.body.email; // Assuming the email is sent in the request body

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Update user's verification code in the database
    user.verificationCode = verificationCode;
    await user.save();

    // Send email with verification code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Randomemail@gmail.com', // Replace with your email address
        pass: 'My password', // Replace with your email password
      },
    });

    const mailOptions = {
      from: 'Some random e-mail address',
      to: user.email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
   
    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});




const changePassword = async (username, oldPassword, newPassword) => {
  try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
          return { success: false, error: 'No existing user found with the given username' };
      }

      // Hash the input old password with the retrieved salt
      const hashedOldPassword = hashPassword(oldPassword, user.salt);

      // Compare the hashed old password with the stored hashed password
      if (hashedOldPassword !== user.password) {
          return { success: false, error: 'Invalid old password inputted' };
      }

      // Generate a new salt and hash the new password
      const newSalt = crypto.randomBytes(16).toString('hex');
      const hashedNewPassword = hashPassword(newPassword, newSalt);

      // Update the user's password and salt
      user.password = hashedNewPassword;
      user.salt = newSalt;

      // Save the updated user to the database
      await user.save();

      return { success: true, message: 'The password has been changed successfully' };
  } catch (error) {
      console.error(error);
      return { success: false, error: 'Internal Server Error' };
  }
};

app.put('/users/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
      // Invoke the changePassword method
      const changePasswordResult = await changePassword(username, oldPassword, newPassword);

      if (!changePasswordResult.success) {
          return res.status(400).json({ error: changePasswordResult.error });
      }

      // Respond with a success message
      return res.status(200).json({ message: changePasswordResult.message });
  } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Method used when forget password is invoked
*/
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

app.put('/users/forget-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if verification code is null
    if (!user.verificationCode) {
      return res.status(400).json({ error: 'The verification code has either not been generated or has been expired' });
    }

    // Check if verification code matches
    if (verificationCode !== user.verificationCode) {
      return res.status(401).json({ error: 'Inputted verification code is incorrect' });
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
});






app.put('/update-profile-pic', async (req, res) => {
  const { username, profilePic } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'No user found from the provided username' });
    }

    // Update the profile pic field
    user.profilePic = profilePic;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






  
