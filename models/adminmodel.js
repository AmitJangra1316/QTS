const mongoose = require('mongoose'); 

const { Schema } = mongoose;

const userSchema = new Schema({
 
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      required: true,
    },

    password: { type: String, minLength: 6, required: true },
    token: String,
  });

exports.Admin = mongoose.model('Admin', userSchema);