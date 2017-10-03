import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const userSchema = Schema({
  name: {
    type: String,
    required: false,
    unique: false
  },
  password: {
    type: String,
    required: false,
    unique: false
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true // Skip checking for uniqueness if the field is missing
  },
  role: {
    type: String,
    required: true,
    default: 'editor' // When register through register form, default role is editor
  },
  invitationID: {
    type: String,
    required: false, // Since superadmins does not need an invitation
    sparse: true,
    unique: true
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

