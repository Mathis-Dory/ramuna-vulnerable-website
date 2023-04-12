import { IsNotEmpty } from 'class-validator';

export class NewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;
}
