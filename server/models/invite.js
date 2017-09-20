import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const inviteSchema = Schema({
  inviteID: {
    type: String,
    required: true
  }
})

export const inviteValidation = Joi.object().keys({
  _id: Joi.object().required(),
  inviteID: Joi.string().required()
}).unknown()

export const Invite = mongoose.model('Invite', inviteSchema)
