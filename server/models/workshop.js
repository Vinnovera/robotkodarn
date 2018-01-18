import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

import { Part } from './part'

const workshopSchema = Schema({
	title: {
		type: String,
		default: 'Ny workshop'
	},
	pincode: {
		type: String,
		unique: true
	},
	author: {
		type: String,
		ref: 'User'
	},
	parts: {
		type: Array,
		default: [new Part({
			title: 'Övning 1',
			content: '/* Skriv din kod här */'
		})]
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
	author: Joi.string().required(),
	parts: Joi.array().required(),
	links: Joi.array().required()
}).unknown()

export const Workshop = mongoose.model('Workshop', workshopSchema)
