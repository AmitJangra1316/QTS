const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
    buildingname: {
        type: String,
        required: true 
    },
    projectname: {
        type: String,
        required: true 
    },
    code: {
        type: String,
        required: true 
    },
    location: {
        type: String,
        required: true 
    },
    buildingtype: {
        type: String,
        required: true 
    },

    assignedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    url:{
        type: String,
        required: true 
    },
});

exports.Project = mongoose.model('Project', projectSchema);