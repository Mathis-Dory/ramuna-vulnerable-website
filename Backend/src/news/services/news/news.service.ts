import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../../../typeorm';
import { NewsDto } from '../../../news/dto/news.dtos';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
  ) {}

  async getAllNews() {
    const news = await this.newsRepository.find();
    if (news.length === 0) {
      throw new HttpException(
        'No news found in the database.',
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  async findNewsById(id: number) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) {
      throw new HttpException(
        'No news found in the database with given requirements.',
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  async findNewsByTitle(news: NewsDto) {
    const foundNews = await this.newsRepository.findOneBy({
      title: news.title,
    });
    return foundNews;
  }

  async postNews(news: NewsDto) {
    const newNews = this.newsRepository.create(news);
    return this.newsRepository.save(newNews);
  }

  async editNews(id: number, news: NewsDto) {
    let newNews;
    try {
      newNews = await this.newsRepository.save({ ...news, id });
    } catch (error) {
      throw error;
    }

    return newNews;
  }

  async deleteNews(id: number) {
    try {
      await this.newsRepository.delete(id);
    } catch (error) {
      throw error;
    }
    return;
  }

  async searchNews(query: string): Promise<News[]> {
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.title ILIKE :query', { query: `%${query}%` })
      .orWhere('news.body ILIKE :query', { query: `%${query}%` })
      .getMany();
  }
}
