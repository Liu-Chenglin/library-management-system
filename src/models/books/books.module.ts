import { BooksController } from './books.controller';
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
