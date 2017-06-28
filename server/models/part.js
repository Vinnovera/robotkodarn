import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const partSchema = Schema({

	title: {
		type: String, required: true
	},
	code: {
		type: String, required: true
	}

})

export const partValidation = Joi.object().keys({
	_id: Joi.object().required(),
	title: Joi.string().required(),
	code: Joi.string().min(10).required()
}).unknown()

export const Part = mongoose.model('Part', partSchema)
