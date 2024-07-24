const models =require('./models/usermodel');
const Client = models.User;

const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');

const clientauth = async (req, res, next) => {
    const token = req.cookies.jwt;
    const key = 'shhhhh';
    try {
        const decoded = jwt.verify(token, key);
        const user = await Client.findOne({ email: decoded.email });
        if (decoded.email) {
            req.token = token;
            req.user = user;
            next();
        } else {
            res.sendStatus(401)
        }
    } catch (error) {
        res.send(error);
    };
};

module.exports = clientauth;