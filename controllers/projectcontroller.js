const async = require('hbs/lib/async');
const model = require('../models/projectmodel');
const Project = model.Project;

const mongoose = require('mongoose');

const modal = require('../models/usermodel');
const User = modal.User;

const { validationResult } = require('express-validator');


function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
exports.viewproject = async (req, res) => {
    const projectId = req.params.id;

    if (!mongoose.isValidObjectId(projectId)) {
        return res.status(400).send('Invalid Project ID');
    }

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        const users = await User.find({}, 'firstName');
        if (users.length === 0) {
            return res.status(404).send('No users found');
        }

        const name = project.description;

        return res.render('singleproject', { projectId, name, users });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).send('An error occurred while fetching the project');
    }
};


exports.addproject = async (req, res) => {
    try {
        const { buildingname, projectname, code, location, buildingtype, url } = req.body;


        const project = new Project({ buildingname, projectname, code, location, buildingtype, url });

        await project.save();

        const projects = await Project.find();

        return res.redirect('/admin/projects');
        return res.render('projects', { projects });
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).send('An error occurred while adding the project');
    }
};


exports.allproject = async (req, res) => {
    const projects = await Project.find();
    return res.render('projects', { projects });
}


exports.assignUsersToProject = async (req, res) => {
    const projectId = req.params.id;
    const newAssignedUsers = req.body.users;
    const projects = await Project.find();


    try {

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send(`Project with ID ${projectId} not found`);
        }

        const isSingleUser = typeof newAssignedUsers === 'string';
        const users = isSingleUser ? [newAssignedUsers] : newAssignedUsers;


        const validAssignedUsers = Array.isArray(users) ? users.filter(id => mongoose.Types.ObjectId.isValid(id)) : [];


        project.assignedUsers = [...project.assignedUsers, ...validAssignedUsers];


        await project.save();

        res.render('projects', { projects });
    } catch (error) {

        console.error('Error assigning users to project:', error);
        res.status(500).send('An error occurred while assigning users to project');
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error });
    }
};

