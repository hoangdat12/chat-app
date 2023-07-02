import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpTokenDocument = HydratedDocument<OtpToken>;

@Schema({ collection: 'OtpToken', timestamps: true })
export class OtpToken {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  secret: string;

  @Prop({ expires: 900, default: Date.now() })
  createdAt: Date;
}

const OtpTokenSchema = SchemaFactory.createForClass(OtpToken);
export const OtpModel = { name: OtpToken.name, schema: OtpTokenSchema };
