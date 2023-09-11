import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { getJwtConfig } from 'src/config/jwt.config';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express/multer';


@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,PrismaService,UserService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: getJwtConfig
    }),
    UserModule
  ]
})
export class AuthModule {}
