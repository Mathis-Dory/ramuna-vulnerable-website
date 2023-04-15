import { IsNotEmpty, IsOptional } from 'class-validator';

export class NewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsOptional()
  file?: string;
}

export class UpdateNewsDto {
  title?: string;
  body?: string;
  file?: string;
}
