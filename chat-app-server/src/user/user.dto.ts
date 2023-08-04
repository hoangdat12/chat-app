import { IsNotEmpty } from 'class-validator';

export class IDataChangeSocialLink {
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  social_link: string;
}

export class DataUpdateInformationUser {
  firstName: string;
  lastName: string;
  job: string;
}
