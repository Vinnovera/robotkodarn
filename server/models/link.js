import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

const linkSchema = Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
})

export const linkValidation = Joi.object().keys({
	_id: Joi.object().required(),
	title: Joi.string().required(),
	content: Joi.string().required()
}).unknown()

/* Used to validate content from user
 * when a new link is created
 */
export const contentValidation = Joi.object().keys({
	title: Joi.string().required(),
	content: Joi.string().required()
}).unknown()

export const Link = mongoose.model('Link', linkSchema)
