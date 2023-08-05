import { IsNotEmpty } from 'class-validator';

export class DataUpdateInformationUser {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  job: string;
}

export class IDataChangeSocialLink {
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  social_link: string;
}

export class DataUpdateAddress {
  address_country: string;

  @IsNotEmpty()
  address_city: string;

  @IsNotEmpty()
  address_state: string;

  @IsNotEmpty()
  address_street: string;

  @IsNotEmpty()
  address_postal_code: string;
}
