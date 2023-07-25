import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'User', timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ default: `http://localhost:8080/assets/default.avatar.jpg` })
  avatarUrl: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 'USER' })
  role: string;

  @Prop({ default: 'email' })
  loginWith: string;

  @Prop({ default: 0 })
  friends?: number;

  @Prop({ default: 0 })
  viewer?: number;

  @Prop({ default: 0 })
  total_post?: number;

  @Prop({ default: 'Student' })
  job?: string;

  @Prop({ default: 'Viet Nam' })
  address?: string;
}

const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = { name: User.name, schema: UserSchema };
