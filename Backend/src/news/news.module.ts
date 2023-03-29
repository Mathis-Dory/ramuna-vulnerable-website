import { Module } from '@nestjs/common';
import { NewsController } from './controllers/news/news.controller';
import { NewsService } from './services/news/news.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
