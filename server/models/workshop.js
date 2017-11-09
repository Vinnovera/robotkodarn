import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const workshopSchema = Schema({
  title: {
    type: String,
    default: 'Ny workshop'
  },
  pincode: {
    type: String,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  parts: {
    type: Array,
    default: []
  },
  links: {
    type: Array,
    default: []
  }
})

export const workshopValidation = Joi.object().keys({
  _id: Joi.object().required(),
  title: Joi.string().required(),
  pincode: Joi.string().required(),
  userId: Joi.string().required(),
  parts: Joi.array().required(),
  links: Joi.array().required()
}).unknown()

export const Workshop = mongoose.model('Workshop', workshopSchema)
