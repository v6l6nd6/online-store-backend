import { Body, Controller, Get, HttpCode, Param, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthLoginDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/reftesh-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*Login, getNewTokens  */

  @Post('file')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:"./uploads",
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))


  handleUpload(@UploadedFile() file: Express.Multer.File,@Body() body) {
    console.log('file', file, body);
    return {file}
  }


  
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }



  
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:"./uploads",
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async register(@Body() dto:AuthDto,@UploadedFile() file: Express.Multer.File,) {
    return this.authService.register(dto,file);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto:AuthLoginDto) {
    return this.authService.login(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/acces-token')
  async getNewTokens(@Body() dto:RefreshTokenDto) {
    return this.authService.getNewTokens(dto.refreshToken);
  }


  
}
 


