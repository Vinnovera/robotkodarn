import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const userSchema = Schema({
  name: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: 'editor' // When register through register form, default role is editor
  },
  invitationID: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    required: true,
    default: false
  }
})

export const User = mongoose.model('User', userSchema)

/**
 * Used when validating a
 * user that has filled in the registration form.
 */
export const userValidation = Joi.object().keys({
  _id: Joi.object().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),
  invitationID: Joi.string().required(),
  complete: Joi.boolean().required()
}).unknown()

