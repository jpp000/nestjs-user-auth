import { Injectable, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { AuthService } from 'src/auth/auth.service'
import { User } from './models/user.model'
import { InjectModel } from '@nestjs/mongoose'
import { SigninDto } from './dto/signin.dto'
import { SignupDto } from './dto/signup.dto'
import { compare } from 'bcrypt'
import { SigninReponse } from './models/signin-response.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async signup(signupDto: SignupDto) {
    const user = new this.usersModel(signupDto)
    return user.save()
  }

  async signin(signinDto: SigninDto): Promise<SigninReponse> {
    const user = await this.findByEmail(signinDto.email)
    const match = await this.checkPassword(signinDto.password, user)

    if (!match) {
      throw new NotFoundException('Invalid Credentials')
    }

    const jwtToken = await this.authService.createAccessToken(user.id)

    return {
      name: user.name,
      jwtToken,
      email: user.email,
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersModel.find()
  }

  async deleteUser(userId: string): Promise<void> {
    await this.usersModel.deleteOne({ _id: userId })
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersModel.findOne({ id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await compare(password, user.password)

    if (!match) {
      throw new NotFoundException('Invalid Password')
    }

    return match
  }
}
