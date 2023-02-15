import { Module } from '@nestjs/common';
import { BooksModule } from './models/books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
