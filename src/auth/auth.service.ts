import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { sign } from 'jsonwebtoken'
import { Model } from 'mongoose'
import { User } from 'src/users/models/user.model'
import { JwtPayload } from './models/jwt-payload.model'
import { Request } from 'express'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
  ) {}

  async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN || '1h',
    })
  }

  async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.usersModel.findOne({
      id: jwtPayload.userId,
    })

    if (!user) {
      throw new UnauthorizedException('User not found.')
    }

    return user
  }

  private jwtExtractor(req: Request): string {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new BadRequestException('Authorization header not found.')
    }

    const [, token] = authHeader.split(' ')
    if (!token) {
      throw new BadRequestException('Token not found.')
    }

    return token
  }

  returnJwtExtractor(): (req: Request) => string {
    return this.jwtExtractor
  }
}
