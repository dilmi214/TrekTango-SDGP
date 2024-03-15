// getIPAddress.js
const os = require('os');

const getIPAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = '';

  // Loop through all network interfaces to find the IPv4 address
  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((iface) => {
      // Check if the interface is IPv4 and not internal
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  return ipAddress;
};

module.exports = getIPAddress;
