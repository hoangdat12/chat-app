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

  @Prop({ default: `${process.env.IMAGE_URL}/default.avatar.jpg` })
  avatarUrl: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 'USER' })
  role: string;

  @Prop({ default: 'email' })
  loginWith: string;
}

const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = { name: User.name, schema: UserSchema };
