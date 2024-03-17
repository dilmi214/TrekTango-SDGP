// const axios = require('axios');

// async function checkLogin(username, password) {
//   try {
//     const response = await axios.post('http://localhost:3000/login', {
//       username: username,
//       password: password
//     });

//     console.log(response.data);
//     // Handle the response data according to your testing requirements
//   } catch (error) {
//     console.error(error.response.data);
//     // Handle errors or failed login attempts
//   }
// }

// // Usage: Provide the username and password strings here
// const testUsername = 'testuser';
// const testPassword = 'hello';

// checkLogin(testUsername, testPassword);

const axios = require('axios');

async function fetchSocialMediaData() {
  try {
    const response = await axios.get('http://localhost:3000/socialMediaData');
    
    console.log(response.data);
    // Handle the response data according to your requirements
  } catch (error) {
    console.error(error.response.data);
    // Handle errors or failed requests
  }
}

// Call the function to fetch social media data
fetchSocialMediaData();

