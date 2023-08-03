import { IsNotEmpty } from 'class-validator';

export class IDataChangeSocialLink {
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  social_link: string;
}
