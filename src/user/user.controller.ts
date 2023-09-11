import { Body, Controller, HttpCode, Param, Post,Get, Put,Patch, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserDto } from './user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}







  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser("id") id:number) {
    return await this.userService.byId(id)
  }


  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Put('profile')
  async getNewTokens(@CurrentUser('id') id:number, @Body() dto:UserDto) {
    return this.userService.updateProfile(id,dto)
  }

@HttpCode(200)
@Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@CurrentUser('id') id:number, @Param('productId') productId:string) {
    return this.userService.toggleFavorite(id,+productId)
  }
 



}