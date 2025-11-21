import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  region: string;

  @Prop()
  subregion: string;

  @Prop()
  capital: string;

  @Prop()
  population: number;

  @Prop()
  flagUrl: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
