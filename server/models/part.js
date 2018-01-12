import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const partSchema = Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
})

export const partValidation = Joi.object().keys({
	_id: Joi.object().required(),
	title: Joi.string().required(),
	content: Joi.string().required()
}).unknown()

/* Used to validate content from user
 * when a new part is created
 */
export const contentValidation = Joi.object().keys({
	title: Joi.string().required(),
	content: Joi.string().required()
}).unknown()

export const Part = mongoose.model('Part', partSchema)
