import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const workshopSchema = Schema({

    title: {
        type: String, required: true
    },
    pincode: {
        type: String, unique: true, required: true
    },
    userId: {
        type: String, required: true
    },
    parts: [],
    links: []

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
