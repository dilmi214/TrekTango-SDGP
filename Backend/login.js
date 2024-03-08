const url = "mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/";
const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

mongoose.connect(url);

//create connection

const connection = mongoose.connection;

const app = express();

// Connect to MongoDB (Make sure to replace 'your-mongodb-uri' with your actual MongoDB connection URI)
mongoose.connect(url);

// Define a mongoose schema for the user data
const userSchema = new mongoose.Schema({
    userID: { type: String, default: uuidv4, required: true }, 
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }, // Salt field added
    profilePic: { type: String, default: null },
    name: {
      firstName: { type: String },
      lastName: { type: String }
    },
    dob: { type: Date }
  });

// Hashing function
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// POST /register route
app.post('/register', async (req, res) => {
    const { username, password, name, dob } = req.body;
  
    try {
      // Generate a random salt
      const salt = crypto.randomBytes(16).toString('hex');
  
      // Hash the password using the salt
      const hashedPassword = hashPassword(password, salt);
  
      // Create a new user instance
      const newUser = new User({
        username,
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

// PUT /change-password route
app.put('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the input old password with the retrieved salt
    const hashedOldPassword = hashPassword(oldPassword, user.salt);

    // Compare the hashed old password with the stored hashed password
    if (hashedOldPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Generate a new salt and hash the new password
    const newSalt = crypto.randomBytes(16).toString('hex');
    const hashedNewPassword = hashPassword(newPassword, newSalt);

    // Update the user's password and salt
    user.password = hashedNewPassword;
    user.salt = newSalt;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /update-profile-pic route
app.put('/update-profile-pic', async (req, res) => {
  const { username, profilePic } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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






  
