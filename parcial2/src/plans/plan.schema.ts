import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Plan extends Document {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  notes?: string;

  @Prop()
  createdAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);