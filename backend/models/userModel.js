import express from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile : {
        type: Number,
        required: true
         
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: { type: Date, default: Date.now}
  });


const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;
