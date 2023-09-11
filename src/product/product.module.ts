
import { PaginationModule } from 'src/pagination/pagination.module'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { CategoryModule } from 'src/category/category.module'
import { Module } from '@nestjs/common'
import { CategoryService } from 'src/category/category.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PrismaService, PaginationService],
  imports: [PaginationModule, CategoryModule],
})
export class ProductModule {}
