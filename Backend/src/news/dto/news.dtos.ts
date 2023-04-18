import { IsNotEmpty, IsOptional } from 'class-validator';

export class NewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsOptional()
  file?: Express.Multer.File | null;
}

export class UpdateNewsDto {
  title?: string;
  body?: string;
  file?: Buffer;
}
