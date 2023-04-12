import { IsNotEmpty } from 'class-validator';

export class NewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  binaryData?: string;
}

export class UpdateNewsDto {
  title?: string;
  body?: string;
  binaryData?: string;
}
