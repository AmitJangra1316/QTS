
const { v4: uuidv4 } = require('uuid');

const generateTemporaryToken = () => {
    return uuidv4(); 
};

module.exports = { generateTemporaryToken };
