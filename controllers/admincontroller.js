const model = require('../models/adminmodel');
const User = model.Admin;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const models = require('../models/projectmodel');
const Project = models.Project;

const modal = require('../models/usermodel');
const Users = modal.User;



exports.login = async (req, res) => {
    const doc = await User.findOne({ email: req.body.email });
    const isauth = await bcrypt.compare(req.body.password, doc.password);
    const token = jwt.sign({ email: req.body.email }, 'shhhhh');

    res.cookie('jwt', token, {
        httpOnly: true,
    });

    doc.token = token;
    await doc.save();

    if (isauth) {
        res.render('admin');
    } else {
        res.render('login')
    }
};

exports.readlogin = (req, res) => {
    res.render('login');
}

exports.readuser = async (req, res) => {
    const p1 = Users.find();
	const p2 = Project.find();
	const promises = await Promise.all([p1, p2]);
	const usersData = promises[0];
	const projectsData = promises[1];
	const users = usersData.map((user) => {
		return {
			...user.toObject(),
			projectsAssigned: projectsData
				.filter((project) => project.assignedUsers.includes(user._id))
				.map((project) => ({ name: project.projectname })),
		};
	});
    return res.render('user', { users });
}

exports.readproject = async (req, res) => {
    try {
      const projects = await Project.find(); 
      res.render('projects', { projects }); 
    } catch (error) {
      console.error('Error fetching projects:', error); 
      res.status(500).send('An error occurred while fetching projects'); 
    }
};

exports.readsignup = (req, res) => {
    res.render('signup');
}

exports.readadmin = (req, res) => {
    res.render('admin');
}

exports.logout =async (req,res)=>{
    try{
    res.clearCookie('jwt');
    req.user.token = null;
    console.log('logout successfull');
    await  req.user.save();
    res.render('login');
    }catch(error){
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

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};