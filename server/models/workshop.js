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
	ancestors: [{
		_id: false,
		workshop: {
			type: String,
			ref: 'Workshop'
		},
		author: {
			type: String,
			ref: 'User'
		}
	}],
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
	},
	grade: {
		type: String
	},
	subject: {
		type: String
	},
	hardware: {
		type: String
	},
	tags: {
		type: Array
	},
	description: {
		type: String
	},
	isPublished: {
		type: Boolean,
		required: true,
		default: false
	}
}, {
	timestamps: true
})

workshopSchema.methods.isAuthorizedToEdit = function (userId) {
	return this.author === userId
}

workshopSchema.methods.populateAncestors = function (workshop) {
	return workshop
		.populate('ancestors.workshop', {
			_id: 1,
			pincode: 1,
			title: 1
		})
		.populate('ancestors.author', {
			_id: 1,
			name: 1
		})
		.execPopulate()
}

export const workshopValidation = Joi.object().keys({
	_id: Joi.object().required(),
	title: Joi.string().required(),
	pincode: Joi.string().required(),
	author: Joi.string().required(),
	ancestors: Joi.array(),
	parts: Joi.array().required(),
	links: Joi.array().required(),
	grade: Joi.string(),
	subject: Joi.string(),
	hardware: Joi.string(),
	tags: Joi.array(),
	description: Joi.string(),
	isPublished: Joi.boolean().required()
}).unknown()

export const Workshop = mongoose.model('Workshop', workshopSchema)
