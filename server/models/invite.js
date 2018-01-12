import mongoose, { Schema } from 'mongoose'
import uuidv4 from 'uuid/v4'

const inviteSchema = Schema({
	inviteID: {
		type: String,
		required: true,
		default: uuidv4
	}
})

export const Invite = mongoose.model('Invite', inviteSchema)
