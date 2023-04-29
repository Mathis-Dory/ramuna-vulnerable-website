import { IsNotEmpty } from 'class-validator';

export class SubmitRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  pdf: Express.Multer.File;
  @IsNotEmpty()
  image: Express.Multer.File;
}

export class EditRequestDto {
  @IsNotEmpty()
  status: string;
}
