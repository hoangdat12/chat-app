import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IUserCreated } from '../ultils/interface';
import { User } from './user.model';

@Schema({ collection: 'Address', timestamps: true })
export class Address {
  @Prop({ type: Types.ObjectId, ref: User.name })
  address_user: IUserCreated;

  @Prop({ default: 'Viet Nam' })
  address_country: string;

  @Prop()
  address_city: string;

  @Prop()
  address_state: string;

  @Prop()
  address_street: string;

  @Prop()
  address_postal_code: string;
}
const AddressSchema = SchemaFactory.createForClass(Address);

export const AddressModel = {
  name: Address.name,
  schema: AddressSchema,
};
