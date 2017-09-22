import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'editor' // When register through register form, default role is editor
  }
})

export const userValidation = Joi.object().keys({
  _id: Joi.object().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required()
}).unknown()

export const User = mongoose.model('User', userSchema)
