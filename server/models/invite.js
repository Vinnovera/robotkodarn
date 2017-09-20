import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'
import uuidv4 from 'uuid/v4'

const inviteSchema = Schema({
  inviteID: {
    type: String,
    required: true,
    default: uuidv4
  }
})

export const inviteValidation = Joi.object().keys({
  _id: Joi.object().required(),
  inviteID: Joi.string().required()
}).unknown()

export const Invite = mongoose.model('Invite', inviteSchema)
