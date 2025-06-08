import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { loginData } from './dto/login-auth.sto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    private JwtService: JwtService
  ) { }

  async signup(singupData: SignupAuthDto) {
    const emailUse = await this.UserModel.findOne({
      email: singupData.email
    })
    if (emailUse) {
      throw new BadRequestException('Email already use');
    }

    const hashpassword = await bcrypt.hash(singupData.password, 10);
    await this.UserModel.create({
      email: singupData.email,
      name: singupData.name,
      password: hashpassword
    })
  }

  async login(credentails: loginData) {
    try {
      const userExist = await this.UserModel.findOne({
        email: credentails.email
      })
      if (!userExist) {
        throw new UnauthorizedException('Eamil not Exist');
      }
      const comparePass = await bcrypt.compare(credentails.password, userExist.password)
      console.log(comparePass);
      if (!comparePass) {
        throw new UnauthorizedException('Password not matches')
      }
      const payload = {
        _id: userExist._id,
        email: userExist.email
      }
      const token = await this.generateUserTokens(payload);
      await this.storeRefreshToken(token.refreshToken, userExist._id)
      console.log("tokem", token)
      return {
        ...token,
        userInfo: {
          _id: userExist._id,
          name: userExist.name,
          email: userExist.email
        }
      }
    } catch (err) {
      console.log('Error login:', err)
      throw err
    }
  }

  async getUserById(userId: string) {
    return await this.UserModel.findById(userId).exec();
  }

  async generateUserTokens(payload) {

    const accessToken = this.JwtService.sign(payload);

    const refreshToken = this.JwtService.sign(payload);

    return { accessToken, refreshToken };
  }
  async storeRefreshToken(token: string, userId) {
    try {
      await this.RefreshTokenModel.create({ token, userId })

    } catch (error) {
      console.log("Error strorinfg refresh token", error)
    }
  }
}
