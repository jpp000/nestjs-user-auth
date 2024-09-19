import { Schema } from 'mongoose'
import { hash } from 'bcrypt'
import { User } from '../models/user.model'

export const UsersSchema = new Schema<User>({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
})

UsersSchema.pre('save', async function (next) {
  try {
    if (!this.isModified()) {
      return next()
    }

    this['password'] = await hash(this['password'], 10)
    next()
  } catch (error) {
    return next(error)
  }
})
