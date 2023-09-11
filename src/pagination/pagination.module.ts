import { Module } from '@nestjs/common'
import { PaginationService } from './pagination.service'
import { ProductService } from 'src/product/product.service'

@Module({
	providers: [PaginationService],
	exports: [PaginationService]
})
export class PaginationModule {}
