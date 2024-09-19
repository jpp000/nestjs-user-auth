import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
