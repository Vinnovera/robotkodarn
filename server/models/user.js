import mongoose, { Schema } from 'mongoose'

const userSchema = Schema({
	
    name: {
        type: String, required: true 
    },
    password: {
        type: String, required: true
    },
    email: {
        type: String, unique: true, required: true
    },
    role: {
        type: String, required: true
    }
    
})

export default mongoose.model('User', userSchema)