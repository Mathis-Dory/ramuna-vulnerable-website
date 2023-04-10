import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from '../../../news/services/news/news.service';
import { Roles } from '../../../common/role.decorator';
import { Role } from '../../../common/role.enum';
import { NewsDto } from '../../../news/dto/news.dtos';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get('/allNews')
  getAllNews() {
    return this.newsService.getAllNews();
  }

  @Get('id/:id')
  findNewsById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findNewsById(id);
  }

  @Roles(Role.Admin)
  @Post('/postNews')
  @UsePipes(ValidationPipe)
  async postNews(@Res() response, @Body() postNewsDto: NewsDto) {
    const existingNews = await this.newsService.findNewsByTitle(postNewsDto);
    if (!existingNews) {
      await this.newsService.postNews(postNewsDto);
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
    @Body() editNewsDto: NewsDto,
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
}
