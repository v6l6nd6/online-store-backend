import { BadRequestException, Injectable, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthDto, AuthLoginDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private prisma:PrismaService, private jwt:JwtService,private userService: UserService){}


  async local(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 200,
      data: file.path,
    };
  }

  async login(dto:AuthLoginDto){
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id)
    return {
        user:this.returnUserFields(user),
        ...tokens
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)
    if (!result) throw new UnauthorizedException('Invalid refresh token')

    const user = await this.userService.byId(result.id, {
        isAdmin: true
    })

    const tokens = await this.issueTokens(user.id)

    return {
        user: this.returnUserFields(user),
        ...tokens
    }
}

  async register(dto:AuthDto,file:any){
    const oldUser = await this.prisma.user.findUnique({
        where:{
            email:dto.email
        }
    })

    if(oldUser) throw new BadRequestException('User already exsist')
    const newFile = await file
console.log(newFile)
    const user = await this.prisma.user.create({
        data:{
            name:dto.name,
            email:dto.email,
            password: await hash(dto.password),
            avatarPath: newFile.filename
        }
    })

    const tokens = await this.issueTokens(user.id)
    return {
        user:this.returnUserFields(user),
        ...tokens
    };
    }

    private async issueTokens(userId:number){
        const data = {id:userId}
        const accessToken = this.jwt.sign(data,{
            expiresIn:'1h'
        })
        const refreshToken = this.jwt.sign(data,{
            expiresIn:'7d'
        })
        return {accessToken,refreshToken}
    }

    private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
            name:user.name,
			email: user.email,
			isAdmin: user.isAdmin,
            avatarPath:user.avatarPath
		}
	}

private async validateUser(dto:AuthLoginDto){
    const user = await this.prisma.user.findUnique({
        where:{
            email:dto.email
        }
    })

    if(!user) throw new BadRequestException('User not found')
    const isValid = await verify(user.password,dto.password);
    if(!isValid) throw new BadRequestException('unvalid password');

    return user
}
}

