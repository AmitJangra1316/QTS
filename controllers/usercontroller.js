const model = require('../models/usermodel');
const User = model.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models/projectmodel');
const async = require('hbs/lib/async');
const Project = models.Project;



exports.login = async (req, res) => {
    try {
        const doc = await User.findOne({ email: req.body.email });
        if (!doc) {
            return res.status(400).render('login', { error: 'User not found' });
        }

        const isauth = await bcrypt.compare(req.body.password, doc.password);
        if (!isauth) {
            return res.status(400).render('login', { error: 'Incorrect password' });
        }

        const token = jwt.sign({ email: req.body.email }, 'shhhhh');
        const name = doc.firstName;
        const projects = await Project.find();
        const userprojects = projects.filter((e) => e.assignedUsers.includes(doc._id));

        res.cookie('jwt', token, {
            httpOnly: true,
        });

        doc.token = token;
        doc.lastLogin = new Date().toLocaleString('en-Us', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        await doc.save();

        return res.render('client', { name, projects: userprojects });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render('login', { error: 'An unexpected error occurred. Please try again later.' });
    }
};

exports.readlogin = (req, res) => {
    res.render('login');
}

exports.readsignup = (req, res) => {
    res.render('clientsignup');
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        req.user.token = null;
        console.log('logout successfull');
        await req.user.save();
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}

exports.signup = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = jwt.sign({ email: req.body.email }, 'shhhhh');
        const hash = bcrypt.hashSync(req.body.password, 10);

        user.token = token;
        user.password = hash;
        res.cookie('jwt', token, {
            httpOnly: true,
        });

        await user.save();

        const users = await User.find();
        res.render('user', { users });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await User.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error });
    }
};
