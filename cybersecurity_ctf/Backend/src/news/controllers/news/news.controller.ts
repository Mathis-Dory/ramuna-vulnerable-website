import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from '../../services/news/news.service';
import { Roles } from '../../../common/role.decorator';
import { Role } from '../../../common/role.enum';
import { NewsDto, UpdateNewsDto } from '../../dto/news.dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get('/allNews')
  async getAllNews() {
    const news = this.newsService.getAllNews();
    if ((await news) != false) {
      return news;
    } else {
      throw new HttpException(
        'No news found in the database.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('id/:id')
  findNewsById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findNewsById(id);
  }

  @Roles(Role.Admin)
  @Post('/postNews')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async postNews(
    @Res() response,
    @Body() postNewsDto: NewsDto,
    @UploadedFile() file,
  ) {
    const existingNews = await this.newsService.findNewsByTitle(postNewsDto);
    if (!existingNews) {
      if (file) {
        await this.newsService.postNews(postNewsDto, file.buffer);
      } else {
        await this.newsService.postNews(postNewsDto);
      }
    } else {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'News already exists with this title',
      });
    }
    return response.status(HttpStatus.CREATED).json({
      postNewsDto,
    });
  }

  @Roles(Role.Admin)
  @Post('/editNews/id/:id')
  @UsePipes(ValidationPipe)
  async editNews(
    @Res() response,
    @Param('id') id,
    @Body() editNewsDto: UpdateNewsDto,
  ) {
    const existingNews = await this.newsService.findNewsById(id);
    if (!existingNews) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'No such news found in the database.',
      });
    } else {
      const newNews = await this.newsService.editNews(id, editNewsDto);
      return response.status(HttpStatus.OK).json(newNews);
    }
  }

  @Roles(Role.Admin)
  @Delete('/deleteNews/id/:id')
  @UsePipes(ValidationPipe)
  async deleteNews(@Res() response, @Param('id') id) {
    const existingNews = await this.newsService.findNewsById(id);
    if (!existingNews) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'No such news found in the database.',
      });
    } else {
      return response
        .status(HttpStatus.OK)
        .json(await this.newsService.deleteNews(id));
    }
  }

  @Get('search')
  async searchNews(@Query('query') query: string) {
    return this.newsService.searchNews(query);
  }
}
